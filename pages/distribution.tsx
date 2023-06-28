import { FullPageLoader } from "@/components";
import { getDistributionListBySubsectors, logout, updateDistributionById, verifyUser } from "@/services";
import { DISTRIBUTION_STATUS, UserDetails } from "@/types";
import { ZONE } from "@/types";
import { getAuthToken } from "@/utils";
import { Button, Card, Col, Input, Layout, Row, message } from "antd";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FiAlertCircle, FiXCircle, FiCheckCircle } from "react-icons/fi";

const inter = Inter({ subsets: ['latin'] })
const { Header, Content } = Layout;

enum STATUS {
    PENDING = "pending",
    COLLECTED = DISTRIBUTION_STATUS.COLLECTED,
    RETURNED = DISTRIBUTION_STATUS.RETURNED
}

export default function DistributionPage() {
    const router = useRouter();

    const [showLoader, setShowLoader] = useState<Boolean>(false);
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [activeState, setActiveState] = useState<STATUS>(STATUS.PENDING);
    const [searchText, setSearchText] = useState<string>("");
    const [distributionList, setDistributionList] = useState<any[]>([]);
    const [filteredDistributionList, setFilteredDistributionList] = useState<any[]>([]);

    const handleLogoutWithMessage = (msg: string | null) => {
        if (msg) {
            message.error(msg)
        }
        logout();
        router.push("/");
    }

    const handleGetDistributionList = () => {
        setShowLoader(true);
        getDistributionListBySubsectors({ assignedArea: userDetails?.assignedArea })
            .then(response => {
                setDistributionList(response.data);
            })
            .catch((err: any) => { })
            .finally(() => {
                setShowLoader(false)
            })
    }

    const handleChangeDistributionStatus = (id: string, status:string) => {
        setShowLoader(true);
        let fieldsObj:any = {
            status,
            "Delivered By":userDetails?.name
        }
        if(status===STATUS.RETURNED){
            fieldsObj["Collected Notes"] = "Not Available"
        }
        updateDistributionById({
            id, 
            fields:fieldsObj
        }).then(() => {
            handleGetDistributionList()
        }).catch((err: any) => { 
            setShowLoader(false)
        })
    }

    useEffect(() => {
        const user = getAuthToken();
        if (!user) {
            handleLogoutWithMessage("User acess denied!");
        } else {
            verifyUser(user).then((response: any) => {
                const userData = response.data;
                if (userData && (userData.zone.includes(ZONE.DABBA) || userData.zone.includes(ZONE.NOT_DABBA))) {
                    setUserDetails(userData)
                } else {
                    handleLogoutWithMessage("User access denied!")
                }
            }).catch(() => {
                handleLogoutWithMessage("User Acess expired!")
            })
        }
    }, [])

    useEffect(() => {
        if (userDetails && userDetails.assignedArea) {
            handleGetDistributionList()
        }
    }, [userDetails])

    useEffect(() => {
        let statusFilteredList = distributionList.filter(value => value.status === activeState);
        if (activeState === STATUS.PENDING) {
            statusFilteredList = distributionList.filter((value: any) => ![STATUS.COLLECTED, STATUS.RETURNED].includes(value.status))
        }
        if (!searchText) {
            setFilteredDistributionList(statusFilteredList)
        } else {
            setFilteredDistributionList(statusFilteredList.filter(file => file.file_number.toString()===searchText||file.full_name.toString().includes(searchText)))
        }

    }, [activeState, searchText, distributionList])

    return (
        <>
            {
                showLoader ? <FullPageLoader /> : null
            }
            <Layout className={`min-h-screen overflow-y-auto ${inter.className}`}>
                <Header className="h-20 p-0 flex px-4 items-center" >
                    <p className="whitespace-nowrap text-lg text-white text-ellipsis overflow-hidden flex-grow">Eid ul Adha</p>
                    <Button
                        onClick={() => handleLogoutWithMessage(null)}
                        type="primary"
                    >
                        Logout
                    </Button>
                </Header>
                <Content className="px-4 py-6">
                    <div className="w-full flex items-center mb-8">
                        <h3 className="text-xl font-normal">Sectors</h3>
                        <h3 className="text-xl font-normal mx-1">:</h3>
                        <p className="flex-grow text-xl">
                            {userDetails && userDetails.assignedArea ? userDetails.assignedArea.join(" , ") : ""}
                        </p>
                    </div>
                    <Row gutter={[16, 16]}>
                        <Col xs={12} md={8} lg={6} xl={4}>
                            <Card
                                onClick={() => setActiveState(STATUS.PENDING)}
                                className={activeState === STATUS.PENDING ? "p-2 rounded-lg card border border-solid border-blue-800 text-blue-800" : "p-2 rounded-lg card"}
                            >
                                <p className="text-sm text-center mb-2">Pending</p>
                                <div className="flex">
                                    <span className="flex items-center justify-center w-12 text-3xl mr-4 text-yellow-500">
                                        <FiAlertCircle />
                                    </span>
                                    <div className="flex flex-col flex-grow">
                                        <p className="text-4xl text-yellow-500">
                                            {
                                                distributionList.filter(
                                                    (val: any) => ![STATUS.RETURNED, STATUS.COLLECTED].includes(val.status)
                                                ).length
                                            }
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col xs={12} md={8} lg={6} xl={4}>
                            <Card
                                onClick={() => setActiveState(STATUS.COLLECTED)}
                                className={activeState === STATUS.COLLECTED ? "p-2 rounded-lg card border border-solid border-blue-800 text-blue-800" : "p-2 rounded-lg card"}
                            >
                                <p className="text-sm text-center mb-2">Delivered</p>
                                <div className="flex">
                                    <span className="flex items-center justify-center w-12 text-3xl mr-4 text-green-500">
                                        <FiCheckCircle />
                                    </span>
                                    <div className="flex flex-col flex-grow">
                                        <p className="text-4xl text-green-500">
                                            {
                                                distributionList.filter(
                                                    (val: any) => val.status === STATUS.COLLECTED
                                                ).length
                                            }
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col xs={12} md={8} lg={6} xl={4}>
                            <Card
                                onClick={() => setActiveState(STATUS.RETURNED)}
                                className={activeState === STATUS.RETURNED ? "p-2 rounded-lg card border border-solid border-blue-800 text-blue-800" : "p-2 rounded-lg card"}
                            >
                                <p className="text-sm text-center mb-2">Returned</p>
                                <div className="flex">
                                    <span className="flex items-center justify-center w-12 text-3xl mr-4 text-red-500">
                                        <FiXCircle />
                                    </span>
                                    <div className="flex flex-col flex-grow">
                                        <p className="text-4xl text-red-500">
                                            {
                                                distributionList.filter(
                                                    (val: any) => val.status === STATUS.RETURNED
                                                ).length
                                            }
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                    <Input
                        placeholder="input search text"
                        allowClear
                        className="my-4"
                        size="large"
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <div className="w-full flex items-start mb-4">
                        <h3 className="text-xl font-normal uppercase">{activeState + " List"}</h3>
                        <h3 className="text-xl mx-1">:</h3>
                    </div>
                    {
                        filteredDistributionList.map((value: any) => (
                            <Card className="card mb-2" key={value.id}>
                                <div className="flex px-2 py-4">
                                    <div className="flex flex-col flex-grow">
                                        <Row gutter={[4, 4]}>
                                            <Col xs={24}>
                                                <span className="text-xs">Name</span>
                                                <p className="text-sm">{value.full_name}</p>
                                            </Col>
                                            <Col xs={12}>
                                                <span className="text-xs">File No</span>
                                                <p className="text-sm">{value.file_number}</p>
                                            </Col>
                                            <Col xs={12}>
                                                <span className="text-xs">Mobile Number</span>
                                                <p className="text-sm">{value.mobile_no}</p>
                                            </Col>
                                            <Col xs={12}>
                                                <span className="text-xs">Building</span>
                                                <p className="text-sm">{value.building}</p>
                                            </Col>
                                            <Col xs={12}>
                                                <span className="text-xs">Room No</span>
                                                <p className="text-sm">{value.room_no}</p>
                                            </Col>
                                            <Col xs={24}>
                                                <span className="text-xs">Address</span>
                                                <p className="text-sm">{value.address}</p>
                                            </Col>
                                            <Col xs={24} className="mt-4">
                                                <Button
                                                    size="small"
                                                    type={activeState === STATUS.PENDING ? "primary" : "default"}
                                                    disabled={activeState !== STATUS.PENDING}
                                                    onClick={()=>handleChangeDistributionStatus(value.id,STATUS.COLLECTED)}
                                                >
                                                    Mark Delivered
                                                </Button>
                                                <Button
                                                    size="small"
                                                    className="bg-red-600 ml-4"
                                                    type={activeState === STATUS.PENDING ? "primary" : "default"}
                                                    disabled={activeState !== STATUS.PENDING}
                                                    onClick={()=>handleChangeDistributionStatus(value.id,STATUS.RETURNED)}
                                                >
                                                    Mark Returned
                                                </Button>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            </Card>
                        ))
                    }
                </Content>
            </Layout>

        </>
    )
}