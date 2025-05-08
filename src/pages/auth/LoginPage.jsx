"use client"

import { useState, useEffect } from "react"
import { Form, Input, Button, Typography, Card } from "antd"
import { UserOutlined, LockOutlined, RocketOutlined } from "@ant-design/icons"
import { Link } from "react-router-dom"
import { useAuth } from "../../hooks/AuthContext"
import { path } from "../../constants/path"
import { motion } from "framer-motion"

const { Title } = Typography

const LoginPage = () => {
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)

  const onFinish = async (values) => {
    setLoading(true)
    try {
      await login(values)
    } catch (error) {
      console.error("Login failed:", error)
    } finally {
      setLoading(false)
    }
  }

  // Particles effect
  const [particles, setParticles] = useState([])

  useEffect(() => {
    // Create random particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 10 + 5,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="relative flex justify-center items-center min-h-screen w-full overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-red-900">
      {/* Background particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white opacity-20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * 100 - 50],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            delay: particle.delay,
          }}
        />
      ))}

      {/* Tech circuit lines */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-full h-full">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"
              style={{
                top: `${10 + i * 8}%`,
                left: 0,
                right: 0,
                opacity: 0.3,
                transform: `translateY(${Math.sin(i) * 20}px)`,
              }}
            />
          ))}
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute w-px bg-gradient-to-b from-transparent via-red-400 to-transparent"
              style={{
                left: `${10 + i * 8}%`,
                top: 0,
                bottom: 0,
                opacity: 0.3,
                transform: `translateX(${Math.sin(i) * 20}px)`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Floating tech icons */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {["💻", "📱", "⌚", "🎧", "🖥️", "📷", "🎮", "⌨️"].map((icon, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl opacity-20"
            initial={{ x: Math.random() * 100 + "%", y: "100%", opacity: 0.2 }}
            animate={{
              y: "-100%",
              opacity: [0.2, 0.5, 0.2],
              rotate: [0, 360],
            }}
            transition={{
              duration: 15 + Math.random() * 20,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 2,
              ease: "linear",
            }}
          >
            {icon}
          </motion.div>
        ))}
      </div>

      {/* Login card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 w-full max-w-md px-4"
      >
        <Card
          className="w-full overflow-hidden backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl"
          style={{ borderRadius: "16px" }}
        >
          <div className="relative">
            {/* Glowing orb behind logo */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-r from-blue-600 to-red-600 blur-xl opacity-50" />

            {/* Logo */}
            <motion.div
              className="flex justify-center mb-6"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              <div className="relative w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-red-600 shadow-lg">
                <RocketOutlined className="text-4xl text-white" />
              </div>
            </motion.div>

            <Title level={2} className="text-center text-white mb-8">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-red-400">
                Đăng Nhập Hệ Thống
              </span>
            </Title>

            <Form
              name="login"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              autoComplete="off"
              size="large"
              className="space-y-6"
            >
              <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: "Vui lòng nhập email!" },
                    { type: "email", message: "Email không hợp lệ!" },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined className="text-gray-400" />}
                    placeholder="Email"
                    className="h-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </Form.Item>
              </motion.div>

              <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                <Form.Item name="password" rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}>
                  <Input.Password
                    prefix={<LockOutlined className="text-gray-400" />}
                    placeholder="Mật khẩu"
                    className="h-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </Form.Item>
              </motion.div>

              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-red-600 border-0 transition-all"
                  >
                    <span className="text-lg font-semibold">Đăng Nhập</span>
                  </Button>
                </Form.Item>
              </motion.div>

              <div className="flex justify-between text-white/70 text-sm">
                <Link to={path.forgotPassword} className="hover:text-blue-400 transition-colors">
                  Quên mật khẩu?
                </Link>
                <Link to={path.registerAdmin} className="hover:text-red-400 transition-colors">
                  Đăng ký tài khoản
                </Link>
              </div>
            </Form>
          </div>
        </Card>
      </motion.div>

      {/* Tech device image */}
      <div className="absolute bottom-0 right-0 w-full max-w-xl opacity-20 pointer-events-none">
        <img src="/placeholder.svg?height=400&width=600" alt="Tech devices" className="w-full" />
      </div>
    </div>
  )
}

export default LoginPage
