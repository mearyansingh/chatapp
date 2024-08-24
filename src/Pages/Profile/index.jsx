import { useContext, useEffect, useState } from "react"
import { Button, Card, Col, Container, Form, Image, Row } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { auth, db } from "../../Config/Firebase"
import Assets from "../../assets/Assets"
import upload from "../../Lib/Upload"
import { AppContext } from "../../Context/AppContext"

const Profile = () => {

	//Context
	const { setUserData } = useContext(AppContext)

	/**Initial state */
	const [image, setImage] = useState(false)
	const [name, setName] = useState("")
	const [bio, setBio] = useState("")
	const [uid, setUid] = useState("")
	const [prevImage, setPrevImage] = useState("")

	const navigate = useNavigate()

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (user) {
				setUid(user.uid);
				const docRef = doc(db, 'users', user.uid);
				const docSnap = await getDoc(docRef);
				if (docSnap.exists()) {
					const data = docSnap.data();
					setName(data.name || "");
					setBio(data.bio || "");
					setPrevImage(data.avatar || "");
				}
			} else {
				navigate("/");
			}
		});

		// Cleanup on component unmount
		return () => unsubscribe();
	}, []);

	/**function to update the profile  */
	const onProfileUpdate = async (e) => {
		e.preventDefault()
		if (!prevImage && !image) {
			toast.error("Upload profile image")
		}
		try {
			const docRef = doc(db, 'users', uid)

			if (image) {
				const imgUrl = await upload(image)
				setPrevImage(imgUrl)
				await updateDoc(docRef, {
					avatar: imgUrl,
					name,
					bio
				})
			} else {
				await updateDoc(docRef, {
					name,
					bio
				})
			}
			const docSnap = await getDoc(docRef)
			setUserData(docSnap.data())
			navigate('/chat')
		} catch (error) {
			console.error(error);
			toast.error(error.message);
		}
	}

	return (
		<div className="profile background">
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
			<Container>
				<Card className="bg-dark bg-opacity-25 shadow border-0">
					<Card.Body className="p-4">
						<Row className="flex-grow-1 g-0">
							<Col sm={6} className="order-2 order-sm-1">
								<Form onSubmit={onProfileUpdate}>
									<h3 className="text-light">Profile Details</h3>
									<Form.Label htmlFor="avatar">
										<Form.Control
											type="file"
											onChange={(e) => setImage(e.target.files[0])}
											id="avatar"
											accept=".png, .jpg, jpeg"
											hidden
										/>
										<Image fluid src={image ? URL.createObjectURL(image) : Assets.avatar_icon} alt="" />
										Upload profile image
									</Form.Label>
									<Form.Control
										type="text"
										placeholder="Your name"
										required
										value={name}
										onChange={(e) => setName(e.target.value)}
									/>
									<Form.Control
										as="textarea"
										placeholder="Write profile bio..."
										required
										value={bio}
										onChange={(e) => setBio(e.target.value)}
									/>
									<Button type="submit">Save</Button>
								</Form>
							</Col>
							<Col sm={6} className="order-1 order-sm-2 d-flex align-items-center justify-content-center">
								<Image fluid className="profile-pic" src={image ? URL.createObjectURL(image) : prevImage ? prevImage : Assets.logo_icon} alt="" />
							</Col>
						</Row>
					</Card.Body>
				</Card>
				{/* <div className="profile-container">
					<Row className="flex-grow-1 g-0">
						<Col sm={6}>
							<Form onSubmit={onProfileUpdate}>
								<h3>Profile Details</h3>
								<Form.Label htmlFor="avatar">
									<Form.Control
										type="file"
										onChange={(e) => setImage(e.target.files[0])}
										id="avatar"
										accept=".png, .jpg, jpeg"
										hidden
									/>
									<Image fluid src={image ? URL.createObjectURL(image) : Assets.avatar_icon} alt="" />
									Upload profile image
								</Form.Label>
								<Form.Control
									type="text"
									placeholder="Your name"
									required
									value={name}
									onChange={(e) => setName(e.target.value)}
								/>
								<Form.Control
									as="textarea"
									placeholder="Write profile bio..."
									required
									value={bio}
									onChange={(e) => setBio(e.target.value)}
								/>
								<Button type="submit">Save</Button>
							</Form>
						</Col>
						<Col sm={6} className="order-sm-1 d-flex align-items-center justify-content-center">
							<Image fluid className="profile-pic" src={image ? URL.createObjectURL(image) : prevImage ? prevImage : Assets.logo_icon} alt="" />
						</Col>
					</Row>
				</div> */}
			</Container>

		</div>
	)
}

export default Profile