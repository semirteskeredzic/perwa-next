import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
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
import { login } from "../lib/auth";
import AppContext from "../context/AppContext";
import styles from '../components/Layout.module.css'
import { one, two, three, four, five, six, seven, eight, nine, ten } from '../assets/loginImages/index'
import Link from "next/link";

function Login(props) {
    const [data, updateData] = useState({ identifier: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [loginImage, setLoginImage] = useState('')
    const router = useRouter();
    const appContext = useContext(AppContext);

    useEffect(() => {
        if (appContext.isAuthenticated) {
            router.push("/"); // redirect if you're already logged in
        }
    }, []);

    useEffect(() => {
        const rndInt = Math.floor(Math.random() * 10) + 1
        setLoginImage(() => `/loginImages/${rndInt}.png`)
    }, [])

    function onChange(event) {
        updateData({ ...data, [event.target.name]: event.target.value });
    }

    return (
        <Container className={styles.container}>
            <Row>
                <Col className={styles.column}>
                    <div className={styles.paper}>
                        <section className={styles.imageSection}>
                            <img className={styles.imageElement} src={loginImage}/>
                        </section>
                        <section className={styles.formSection}>
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
                                <div className={styles.titleLabel}>Sign in to your Perwa account</div>
                                <fieldset disabled={loading}>
                                    <FormGroup>
                                        <Label>Email:</Label>
                                        <Input
                                            onChange={(event) => onChange(event)}
                                            name="identifier"
                                            style={{ height: 50, fontSize: "1.2em" }}
                                        />
                                    </FormGroup>
                                    <FormGroup style={{ marginBottom: 30 }}>
                                        <Label>Password:</Label>
                                        <Input
                                            onChange={(event) => onChange(event)}
                                            type="password"
                                            name="password"
                                            style={{ height: 50, fontSize: "1.2em" }}
                                        />
                                    </FormGroup>

                                    <FormGroup>
                    <span>
                      <a href="">
                        <small style={{color: '#10378D'}}>Forgot Password?</small>
                      </a>
                    </span>
                                        <Button
                                            style={{ float: "right", width: 120, background: '#10378D', border: '1px solid #10378D' }}
                                            // color="primary"
                                            onClick={() => {
                                                setLoading(true);
                                                login(data.identifier, data.password)
                                                    .then((res) => {
                                                        setLoading(false);
                                                        // set authed User in global context to update header/app state
                                                        appContext.setUser(res.data.user);
                                                        router.push('/')
                                                    })
                                                    .catch((error) => {
                                                        setError(error.response.data);
                                                        setLoading(false);
                                                    });
                                            }}
                                        >
                                            {loading ? "Loading... " : "Submit"}
                                        </Button>
                                    </FormGroup>
                                </fieldset>
                                <div className={styles.registerQuestion}>
                                    Don't have an account?
                                    <Link href="/register">
                                        <a style={{display: 'inline-block'}} className="nav-link">Register here</a>
                                    </Link>
                                </div>
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
}

export default Login;