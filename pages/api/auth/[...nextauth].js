import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import axios from "axios";

const options = {
    providers: [
        Providers.Credentials({
            name: 'Email & Password',

            credentials: {
                email: { label: "Email", type: "text", placeholder: "example@email.com" },
                password: {  label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    const { data } = await axios.post('http://142.93.98.172:1337/auth/local', {
                        identifier: credentials.email,
                        password: credentials.password
                    })
                    if (data) {
                        return data
                    }
                } catch(err) {
                    console.log(err)
                }
            }
        })
    ],
    session: {
        jwt: true,
    },

    callbacks: {
        session: async (session, user) => {
            session.jwt = user.jwt;
            session.id = user.id;
            return Promise.resolve(session);
        },
        // Getting the JWT token from API response
        jwt: async (token, user, account) => {
            const isSignIn = user ? true : false;
            if (isSignIn) {
                token.jwt = user.jwt;
                token.id = user.user.id;
            }
            return Promise.resolve(token);
        },


    }
}

export default (req, res) => NextAuth(req, res, options)
