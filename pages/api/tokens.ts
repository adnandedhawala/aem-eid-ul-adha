import { ResponseData } from "@/types";
import { tokensTable } from "@/utils";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData | string>
) {
    if (req.method === 'GET') {
        const finalData: any[] = [];
        await tokensTable.select({
            view: "Grid view",
        }).eachPage(function page(records, fetchNextPage) {

            records.forEach(function (record) {
                finalData.push({ ...record.fields, id: record.id });
            });

            fetchNextPage();

        }, function done(err) {
            if (err) {
                return res.status(500).send("Error in fetching data!")
            }
            return res.status(200).send({ data: finalData })
        });

    } else if (req.method === 'PUT') {
        const { data } = req.body;
        if (!data) return res.status(400).end("data is missing!");
        if (!data.id) return res.status(400).end("data is missing!");
        if (!data.key) return res.status(400).end("data is missing!");
        if (!data.value) return res.status(400).end("data is missing!");

        await tokensTable.update([{
            id: data.id,
            fields: {
                [data.key]: data.value
            }
        }], function (error: any) {
            if (error) {
                return res.status(500).send("Something went wrong updating tokens")
            }
            return res.status(200).send({ data: "Tokens Updated Successfully!" })
        })

    } else {
        return res.status(404).end("API not found")
    }
}

