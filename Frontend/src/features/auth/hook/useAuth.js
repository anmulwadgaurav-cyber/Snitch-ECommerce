import { setError, setUser, setLoading } from "../state/auth.slice.js";
import { register, login, getMe } from "../service/auth.api.js";
import { useDispatch } from "react-redux";

export const useAuth = () => {
  const dispatch = useDispatch();

  async function handleRegister({
    email,
    contact,
    password,
    fullname,
    isSeller = false,
  }) {
    const data = await register({
      email,
      contact,
      password,
      fullname,
      isSeller,
    });
    dispatch(setUser(data.user));
    return data.user.role;
  }

  async function handleLogin({ email, password }) {
    const data = await login({ email, password });
    dispatch(setUser(data.user));
    return data.user.role;
  }

  async function handleGetMe() {
    try {
      dispatch(setLoading(true));
      const data = await getMe();
      dispatch(setUser(data.user));
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoading(false));
    }
  }

  return { handleRegister, handleLogin, handleGetMe };
};
