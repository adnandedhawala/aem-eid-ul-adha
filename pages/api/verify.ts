import { ResponseData } from "@/types";
import { verify } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData | string>
) {
    if (req.method === 'POST') {
        const { data } = req.body;
        if (!data) return res.status(400).end("data is missing!");
        if (!data.token) return res.status(400).end("token is missing!");
        verify(data.token, process.env.NEXT_PUBLIC_ACCESS_TOKEN_SALT as string, function (error: any, decoded: any) {
            if (error) {
                return res.status(401).send("user session has expired");
            } else {
                return res.status(200).send({ data: decoded })
            }
        })
    } else {
        return res.status(404).end("API not found")
    }
}
