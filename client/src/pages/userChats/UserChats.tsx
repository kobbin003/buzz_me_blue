import { io } from "socket.io-client";
import ChatNav from "../../components/chatNav/ChatNav";
import Conversations from "../../components/conversations/Conversations";
import { auth } from "../../firebase/config";
import { ShowConversationProvider } from "../../context/ShowConversationProvider";
import { useNavigate } from "react-router-dom";
import { removeUser, setUser } from "../../redux/reducers/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useGetUserProfileQuery } from "../../api/users";
import { RootState } from "../../redux/store/store";
import { removeAccessToken } from "../../redux/reducers/authSlice";
import SocketProvider from "../../context/SocketProvider";
// import "../../socket";
type Props = {};

export const UserChats = ({}: Props) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { accessToken } = useSelector((state: RootState) => state.auth);
	const { data, error, isLoading, isSuccess, ...rest } = useGetUserProfileQuery(
		{ accessToken },
		{ skip: !accessToken }
	);
	if (error) {
		console.log("userchats error", error);
	}
	console.log("rest", rest);
	// console.log("userprofile-data", data, error, isLoading);
	//***** */
	useEffect(() => {
		if (isSuccess) {
			const { name, email, email_verified, status, profilePicUrl, _id } = data;
			if (profilePicUrl) {
				dispatch(
					setUser({
						name,
						email,
						email_verified,
						status,
						profilePicUrl,
						uid: _id,
					})
				);
			}
		}
	}, [isSuccess]);
	//***** */
	// const [showConversation, setShowConversation] = useState(false);
	// onAuthStateChanged(auth, (user) => {
	// 	if (user) {
	// 		console.log("User is signed in.", user);
	// 	} else {
	// 		console.log("User is not-signed in.");
	// 	}
	// });
	// console.log(auth.currentUser);

	const handleSignout = () => {
		auth.signOut();
		dispatch(removeUser());
		dispatch(removeAccessToken());
		navigate("/");
	};

	return (
		<>
			{isLoading ? (
				<p>Loading...</p>
			) : (
				<SocketProvider>
					<div className="flex flex-col h-screen" data-theme="cupcake">
						<button onClick={handleSignout}>signout</button>

						<ShowConversationProvider>
							<div className="flex h-full bg-green-200">
								<ChatNav />
								<Conversations />
							</div>
						</ShowConversationProvider>
					</div>
				</SocketProvider>
			)}
		</>
	);
};
