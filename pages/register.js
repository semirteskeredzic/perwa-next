import React, {useState, useContext, useEffect} from "react";

import {
    Container,
    Row,
    Col,
    Button,
    Form,
    FormGroup,
    Label,
    Input,
} from "reactstrap";
import { registerUser } from "../lib/auth";
import AppContext from "../context/AppContext";
const Logo = require("../assets/ypw2.png")
import styles from '../components/Layout.module.css'
import Link from "next/link";
import {useRouter} from "next/router";

const Register = () => {
    const [data, setData] = useState({ email: "", username: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({});
    const [loginImage, setLoginImage] = useState('')
    const appContext = useContext(AppContext);
    const router = useRouter()

    useEffect(() => {
        const rndInt = Math.floor(Math.random() * 10) + 1
        setLoginImage(() => `/loginImages/${rndInt}.png`)
    }, [])

    return (
        <Container className={styles.container}>
            <Row>
                <Col className={styles.column}>
                    <div className={styles.paper}>
                        <section className={styles.imageSection}>
                            <img className={styles.imageElement} src={loginImage}/>
                        </section>
                        <section className={styles.registerFormSection}>
                            {Object.entries(error).length !== 0 &&
                            error.constructor === Object &&
                            error.message.map((error) => {
                                return (
                                    <div
                                        key={error.messages[0].id}
                                        style={{ marginBottom: 10 }}
                                    >
                                        <small style={{ color: "red" }}>
                                            {error.messages[0].message}
                                        </small>
                                    </div>
                                );
                            })}
                            <Form>
                                <div className={styles.titleLabel}>Register your Perwa account</div>
                                <fieldset disabled={loading}>
                                    <FormGroup>
                                        <Label>Username:</Label>
                                        <Input
                                            disabled={loading}
                                            onChange={(e) =>
                                                setData({ ...data, username: e.target.value })
                                            }
                                            value={data.username}
                                            type="text"
                                            name="username"
                                            style={{ height: 50, fontSize: "1.2em" }}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Email:</Label>
                                        <Input
                                            onChange={(e) =>
                                                setData({ ...data, email: e.target.value })
                                            }
                                            value={data.email}
                                            type="email"
                                            name="email"
                                            style={{ height: 50, fontSize: "1.2em" }}
                                        />
                                    </FormGroup>
                                    <FormGroup style={{ marginBottom: 30 }}>
                                        <Label>Password:</Label>
                                        <Input
                                            onChange={(e) =>
                                                setData({ ...data, password: e.target.value })
                                            }
                                            value={data.password}
                                            type="password"
                                            name="password"
                                            style={{ height: 50, fontSize: "1.2em" }}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <div className={styles.loginQuestion}>
                                            <Link href="/login">
                                                <a style={{display: 'inline-block', paddingLeft: 0}} className="nav-link">Back to Login</a>
                                            </Link>
                                        </div>
                                        <Button
                                            style={{ float: "right", width: 120, background: '#10378D', border: '1px solid #10378D'}}
                                            // color="primary"
                                            disabled={loading}
                                            onClick={() => {
                                                setLoading(true);
                                                registerUser(data.username, data.email, data.password)
                                                    .then((res) => {
                                                        // set authed user in global context object
                                                        appContext.setUser(res.data.user);
                                                        setLoading(false);
                                                        router.push('/');
                                                    })
                                                    .catch((error) => {
                                                        setError(error.response.data);
                                                        setLoading(false);
                                                    });
                                            }}
                                        >
                                            {loading ? "Loading.." : "Register"}
                                        </Button>
                                    </FormGroup>
                                </fieldset>
                            </Form>
                        </section>
                    </div>
                </Col>
            </Row>
            <style jsx>
                {`
          .paper {
            border: 1px solid lightgray;
            box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2),
              0px 1px 1px 0px rgba(0, 0, 0, 0.14),
              0px 2px 1px -1px rgba(0, 0, 0, 0.12);
            border-radius: 6px;
            margin-top: 90px;
          }
          .notification {
            color: #ab003c;
          }
          .header {
            width: 100%;
            height: 120px;
            background-color: #2196f3;
            margin-bottom: 30px;
            border-radius-top: 6px;
          }
          .wrapper {
            padding: 10px 30px 20px 30px !important;
          }
          a {
            color: blue !important;
          }
          img {
            width: 100%;
            height: 100%;
          }
        `}
            </style>
        </Container>
    );
};
export default Register;