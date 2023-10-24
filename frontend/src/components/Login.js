import {useRef, useState, useEffect, useContext} from 'react';
import axios from './axios'
import AuthContext from './AuthProvider';

function Login() {
    const { setAuth } = useContext(AuthContext);
    const userRef = useRef();
    const errRef = useRef();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        const response = await axios.post(
            '/user/login/',
            JSON.stringify({ email, password }),
            {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
            }
        );
        const accessToken = response?.data?.accessToken;
        console.log(accessToken);
        setAuth({ email, password, accessToken });
        setEmail("");
        setPassword("");
        setSuccess(true);
        } catch (err) {
        if (!err?.response) {
            setErr("No Server Response");
        } else if (err.response?.status === 400) {
            setErr("Missing Username or Password");
        } else if (err.response?.status === 401) {
            setErr("Unauthorized");
        } else {
            setErr("Login Failed");
        }
        errRef.current.focus();
        }
    };

    useEffect(() => {
        userRef.current.focus();
    }, []);
    useEffect(() => {
        setErr("");
    }, [email, password]);

    return (
        <>
        {success ? (
          <section>
            <h1>You are logged in!</h1>
            <p>{}</p>
            <br />
            <p>{/* <a href="#">Go to Home</a> */}</p>
          </section>
        ) : (
          <section>
            <p
              ref={errRef}
              className={err ? "errmsg" : "offscreen"}
              aria-live="assertive"
            >
              {err}
            </p>
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>
              <label htmlFor="email">Email:</label>
              <input
                type="text"
                id="email"
                ref={userRef}
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
              />
              <button>Sign In</button>
            </form>
            <p>
              Need an Account?
              <br />
              <span className="line">
                <a href="#">Sign Up</a>
              </span>
            </p>
          </section>
        )}
        </>
    );
}
export default Login;
