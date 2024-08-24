import { useState } from 'react'
import { Button, Card, Col, Form, Image, Row } from 'react-bootstrap'
import Assets from '../../assets/Assets'
import { signup, login, resetPass } from '../../Config/Firebase'
function Login() {

	/**Initial state */
	const [currState, setCurrState] = useState('Sign up')
	const [username, setUsername] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const onSubmitHandler = (e) => {
		e.preventDefault()
		if (currState === 'Sign up') {
			signup(username, email, password,)
		} else {
			login(email, password,)
		}
	}

	return (
		<div className='login d-lg-flex background'>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			<Image fluid src={Assets.logo_big} alt='Logo' className='logo z-1' />
			<Col className="px-3 px-sm-0 col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-4">
				<Card className="bg-white bg-opacity-25 border-0 rounded-3 shadow-sm">
					<Card.Body className="p-3 p-md-4 p-xl-5">
						<div className="text-center mb-3">
							<Image fluid src={Assets.logo} alt="Logo" width="175" height="57" />
						</div>
						<h2 className="fs-6 fw-normal text-center mb-4">{currState} to your account</h2>
						<Form onSubmit={onSubmitHandler} className='login-form'>
							<Row className="row gy-3 overflow-hidden">
								{
									currState === "Sign up" ?
										<Col className="col-12">
											<Form.Control
												type="text"
												id="username"
												name="username"
												value={username}
												placeholder="Username"
												className=''
												required
												onChange={(e) => setUsername(e.target.value)}
											/>
										</Col>
										:
										null
								}
								<Col className="col-12">
									<Form.Control
										type="email"
										id="email"
										name="email"
										value={email}
										placeholder="name@example.com"
										required
										onChange={(e) => setEmail(e.target.value)}
									/>
								</Col>
								<Col className="col-12">
									<Form.Control
										type="password"
										id="password"
										name="password"
										value={password}
										placeholder="Password"
										required
										onChange={(e) => setPassword(e.target.value)}
									/>
								</Col>
								<Col className="col-12">
									<div className="d-flex flex-wrap gap-2 justify-content-between">
										<Form.Check id="tnc">
											<Form.Check.Input type="checkbox" required />
											<Form.Check.Label>Agree to the terms of use and privacy policy.</Form.Check.Label>
										</Form.Check>
										{currState === "Login" ? <Button onClick={() => resetPass(email)} variant='link' className='p-0 text-decoration-none'>Forgot password?</Button> : null}
									</div>
								</Col>
								<div className="col-12">
									<div className="d-grid">
										<Button size="lg" type="submit">{currState === "Sign up" ? "Create Account" : "Login Now"}</Button>
									</div>
								</div>
								<div className="col-12">
									{currState === 'Sign up' ?
										<p className="m-0 text-center">Already have an account? <a href="#!" className="link-primary text-decoration-none" onClick={() => setCurrState("Login")}>Login</a></p>
										:
										<p className="m-0 text-center">Don&apos;t have an account? <a href="#!" className="link-primary text-decoration-none" onClick={() => setCurrState("Sign up")}>Sign up</a></p>
									}
								</div>
							</Row>
						</Form>
					</Card.Body>
				</Card>
			</Col>
		</div>
	)
}

export default Login