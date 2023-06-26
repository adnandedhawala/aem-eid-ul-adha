// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ResponseData } from '@/types'
import type { NextApiRequest, NextApiResponse } from 'next'
import { sign } from "jsonwebtoken";
import { userTable } from '@/utils';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData | string>
) {
    if (req.method === 'POST') {
        const { data } = req.body;
        if (!data) return res.status(400).end("login data is missing!");
        if (!data.its) return res.status(400).end("login data is missing!");
        const memberData = await userTable.select({
          view: "Grid view",
          filterByFormula: `({itsId} = '${data.its}')`,
        })
          .firstPage();
    
        if (!memberData.length) {
          return res.status(400).end("User not found!");
        } else {
          const userData:any = { ...memberData[0].fields, id: memberData[0].id }
          const authToken = sign(
            userData,
            process.env.NEXT_PUBLIC_ACCESS_TOKEN_SALT as string,
            {
              expiresIn: "12h"
            }
          )
          return res.status(200).send({ data: authToken });
        }
      } else {
        return res.status(404).end("API not found")
      }
}