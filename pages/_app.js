import '../styles/globals.css'
import React, { useState, useEffect } from 'react';
import { ApolloProvider, createHttpLink } from '@apollo/client';
import { ApolloClient, InMemoryCache } from '@apollo/client';
// import { setContext } from '@apollo/client/link/context';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { SearchProvider } from '../store/SearchStore';
import Cookie from "js-cookie";
import Head from "next/head";
import fetch from "isomorphic-fetch";
import Layout from "../components/Layout";
import '../styles/main.css';
import AppContext from "../context/AppContext";
// import { Provider } from 'next-auth/client'
import "@fortawesome/fontawesome-svg-core/styles.css"; // import Font Awesome CSS
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;
import * as Sentry from "@sentry/react";
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

Sentry.init({
  dsn: "https://e0f7ace391e3491b97d37af3f4402691@o772478.ingest.sentry.io/5795987",
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});


const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    console.log('graphQLErrors', graphQLErrors);
  }
  if (networkError) {
    console.log('networkError', networkError);
  }
});

const httpLink = createHttpLink({
  uri: 'http://142.93.98.172:1337/graphql',

});

const link = ApolloLink.from([errorLink, httpLink]);

export const client = new ApolloClient({
  link,
  fetchOptions: {
    mode: 'no-cors'
  },
  headers: {
    "Access-Control-Allow-Headers": "sentry-trace"
  },
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        Part: {
          parts: {
            fields: {
              merge(existing, incoming) {
                return incoming;
              }
            }
          }
        },
        Product: {
          products: {
            fields: {
              merge(existing,incoming) {
                return incoming;
              }
            }
          }
        }
      }
    }
  })
});

function MyApp({ Component, pageProps }) {

  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = Cookie.get("token")

    if (token) {
      // authenticate the token on the server and place set user object
      fetch(`http://142.93.98.172:1337/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(async (res) => {
        // if res comes back not valid, token is not valid
        // delete the token and log the user out on client
        if (!res.ok) {
          Cookie.remove("token");
          setUser(null)
          return null
        }
        const user = await res.json()
        setUser(user)
      });
    }
  },[])

  return (
      <AppContext.Provider
          value={{
            user: user,
            isAuthenticated: !!user,
            setUser: setUser,
          }}
      >
        <ApolloProvider client={client}>
          <ReactNotification />
          <Head>
            <link
                rel="stylesheet"
                href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
                integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
                crossOrigin="anonymous"
            />
          </Head>
          <SearchProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </SearchProvider>
        </ApolloProvider>
      </AppContext.Provider>
      )
}

export default MyApp
