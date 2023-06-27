import { FullPageLoader, GoshList, PayaList, ZabihatList } from "@/components";
import { getTokensList, logout, updateTokenById, verifyUser } from "@/services";
import { TOKEN_COUNTER, UserDetails, ZONE } from "@/types";
import { getAuthToken } from "@/utils";
import { Button, Layout, Radio, message } from "antd"
import { Inter } from "next/font/google"
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ['latin'] })
const { Header, Content } = Layout;

export default function TokensPage() {
    const router = useRouter();

    const [showLoader, setShowLoader] = useState<Boolean>(false);
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [tokenPageView, setTokenPageView] = useState<String>("");
    const [tokenList, setTokenList] = useState<any[]>([]);

    const handleLogoutWithMessage = (msg: string | null) => {
        if (msg) {
            message.error(msg)
        }
        logout();
        router.push("/");
    }

    const handleGetTokens = () => {
        setShowLoader(true);
        getTokensList()
            .then(response => {
                setTokenList(response.data)
            })
            .catch((err: any) => { })
            .finally(() => {
                setShowLoader(false)
            })
    }

    const changeTokenStatus = (id: string, key: string, value: string) => {
        setShowLoader(true);
        updateTokenById({
            id, key, value
        }).then(() => {
            handleGetTokens()
        }).catch((err: any) => { })
    }

    useEffect(() => {
        const user = getAuthToken();
        if (!user) {
            handleLogoutWithMessage("User acess denied!");
        } else {
            verifyUser(user).then((response: any) => {
                const userData = response.data;
                if (userData && userData.zone.includes(ZONE.TOKEN)) {
                    setUserDetails(userData)
                    setTokenPageView(userData?.assignedArea[0] as string)
                } else {
                    handleLogoutWithMessage("User access denied!")
                }
            }).catch(() => {
                handleLogoutWithMessage("User Acess expired!")
            })
        }
    }, [])

    useEffect(() => {
        handleGetTokens()
    }, [userDetails])

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
                    {
                        userDetails && userDetails.assignedArea && userDetails.assignedArea.length > 1 ?
                            <div className="flex justify-center w-full mb-4">
                                <Radio.Group
                                    size="large"
                                    options={userDetails.assignedArea.map((value: string) => ({ label: value, value }))}
                                    onChange={(e) => setTokenPageView(e.target.value)}
                                    value={tokenPageView}
                                    optionType="button"
                                    buttonStyle="solid"
                                />
                            </div> :
                            <h1 className="text-3xl font-normal text-center mb-4" >{tokenPageView ? tokenPageView + "  Counter" : ""}</h1>
                    }
                    {
                        tokenPageView === TOKEN_COUNTER.ZABIHAT ?
                            <ZabihatList handleChangeStatus={changeTokenStatus} tokenList={tokenList} /> :
                            tokenPageView === TOKEN_COUNTER.PAYA ?
                            <PayaList handleChangeStatus={changeTokenStatus} tokenList={tokenList} />:
                            tokenPageView === TOKEN_COUNTER.GOSH ?
                            <GoshList handleChangeStatus={changeTokenStatus} tokenList={tokenList} />:
                            null
                    }
                </Content>
            </Layout>
        </>
    )
}