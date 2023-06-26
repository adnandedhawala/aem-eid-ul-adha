import Image from 'next/image'
import { Inter } from 'next/font/google'
import { Button, Card, Form, InputNumber, message } from 'antd'
import { useEffect, useState } from 'react'
import { getAuthToken, saveAuthToken } from '@/utils'
import { useRouter } from 'next/router'
import { login, logout, verifyUser } from '@/services'
import { ZONE } from '@/types'
import { FullPageLoader } from '@/components'

const inter = Inter({ subsets: ['latin'] })

export default function Login() {

  const router = useRouter();

  const [showLoader, setShowLoader] = useState<Boolean>(false);

  const redirectBasedOnUser = (data: any) => {
    if (data && data.zone && data.zone.includes(ZONE.TOKEN)) {
      router.push("/tokens")
    }else{
      router.push("/distribution")
    }
  };

  const handleLogin = (values: any) => {
    setShowLoader(true)
    login(values)
      .then(response => {
        saveAuthToken(response.data)
        return response.data
      }).then(async (data) => {
        return await verifyUser(data).then((verifyResponse: any) => verifyResponse)
      }).then((userData: any) => redirectBasedOnUser(userData.data))
      .catch((error: string) => message.error(error))
      .finally(() => {
        setShowLoader(false)
      })
  }

  useEffect(() => {
    const user = getAuthToken();
    if (!!user) {
      verifyUser(user).then((data) => {
        redirectBasedOnUser(data.data);
      }).catch(() => {
        logout()
      })
    }
  }, [])

  return (
    <main
      className={`flex min-h-screen items-center justify-center p-6 ${inter.className}`}
    >
      {
        showLoader ? <FullPageLoader /> : null
      }
      <Card className='w-full md:max-w-sm'>
        <div className='flex justify-center '>
          <Image width={125} height={125} src="/jamaatLogo.png" alt="logo" />
        </div>
        <h1 className='text-2xl text-center my-8'>Eid ul Adha</h1>
        <Form
          name="login"
          onFinish={handleLogin}
          requiredMark={false}
          layout="vertical"
          size='large'
        >
          <Form.Item
            label=""
            name="its"
            rules={[
              {
                required: true,
                message: 'Please input your its!',
              },
            ]}
          >
            <InputNumber placeholder='Enter ITS' className='w-full' />
          </Form.Item>

          <Form.Item className='text-center'>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>

    </main>
  )
}
