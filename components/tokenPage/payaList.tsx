import { TOKEN_COUNTER } from "@/types";
import { Button, Card, Col, Input, Row } from "antd"
import { FC, useEffect, useState } from "react";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";

enum STATUS {
    PENDING = "pending",
    COMPLETED = "completed",
}

export const PayaList: FC<{ tokenList: any[], handleChangeStatus: any }> = ({ tokenList, handleChangeStatus }) => {
    const [activeState, setActiveState] = useState<STATUS>(STATUS.PENDING);
    const [searchText, setSearchText] = useState<string>("");
    const [filteredTokenList, setFilteredTokenList] = useState<any[]>([]);

    useEffect(() => {
        let statusFilteredList = tokenList.filter(val => val[TOKEN_COUNTER.PAYA] === activeState);
        if(activeState === STATUS.PENDING){
            statusFilteredList= tokenList.filter(val => val[TOKEN_COUNTER.ZABIHAT] === STATUS.COMPLETED).filter(val => val[TOKEN_COUNTER.PAYA] === activeState)
        }
        if (!searchText) {
            setFilteredTokenList(statusFilteredList)
        } else {
            setFilteredTokenList(statusFilteredList.filter(file => JSON.stringify(file).includes(searchText)))
        }

    }, [activeState, searchText, tokenList])

    return (
        <>
            <h1 className="font-normal text-lg mt-8 mb-2"><span>Completed Zabihat : </span><span>{tokenList.filter(val=>val[TOKEN_COUNTER.ZABIHAT]===STATUS.COMPLETED).length}</span></h1>
            <h1 className="font-normal text-lg mb-2"><span>Pending Zabihat : </span><span>{tokenList.filter(val=>val[TOKEN_COUNTER.ZABIHAT]===STATUS.PENDING).length}</span></h1>
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
                                        tokenList.filter(
                                            (val) => val[TOKEN_COUNTER.ZABIHAT] === STATUS.COMPLETED
                                        ).filter(
                                            (val) => val[TOKEN_COUNTER.PAYA] === STATUS.PENDING
                                        ).length
                                    }
                                </p>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col xs={12} md={8} lg={6} xl={4}>
                    <Card
                        onClick={() => setActiveState(STATUS.COMPLETED)}
                        className={activeState === STATUS.COMPLETED ? "p-2 rounded-lg card border border-solid border-blue-800 text-blue-800" : "p-2 rounded-lg card"}
                    >
                        <p className="text-sm text-center mb-2">Completed</p>
                        <div className="flex">
                            <span className="flex items-center justify-center w-12 text-3xl mr-4 text-green-500">
                                <FiCheckCircle />
                            </span>
                            <div className="flex flex-col flex-grow">
                                <p className="text-4xl text-green-500">
                                    {
                                        tokenList.filter(
                                            (val) => val[TOKEN_COUNTER.PAYA] === STATUS.COMPLETED
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
                filteredTokenList.map((value: any) => (
                    <Card className="card mb-2" key={value.id}>
                        <div className="flex px-2 py-4">
                            <div className="flex flex-col flex-grow">
                                <Row gutter={[4, 4]}>
                                    <Col xs={12}>
                                        <span className="text-xs">Token</span>
                                        <p className="text-sm">{value["Token Number"]}</p>
                                    </Col>
                                    <Col xs={12}>
                                        <span className="text-xs">File No</span>
                                        <p className="text-sm">{value["File Number"]}</p>
                                    </Col>
                                    <Col xs={24}>
                                        <span className="text-xs">Name</span>
                                        <p className="text-sm">{value["Name"]}</p>
                                    </Col>
                                    <Col xs={24} className="text-center">
                                        <Button
                                            size="small"
                                            type={activeState === STATUS.PENDING?"primary":"default"}
                                            onClick={() => handleChangeStatus(value.id, TOKEN_COUNTER.PAYA, activeState === STATUS.PENDING ? STATUS.COMPLETED : STATUS.PENDING)}
                                        >
                                            {
                                                activeState === STATUS.PENDING ? "Mark Complete" : "Mark Pending"
                                            }
                                        </Button>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </Card>
                ))
            }
        </>
    )
}