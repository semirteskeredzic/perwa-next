import React, { Component } from 'react'
import { gql, ApolloProvider } from '@apollo/client'
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client'
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';

const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      console.log('graphQLErrors', graphQLErrors);
    }
    if (networkError) {
      console.log('networkError', networkError);
    }
  });

const httpLink = createUploadLink({ uri: 'http://142.93.98.172:1337/graphql' });

const link = ApolloLink.from([errorLink, httpLink]);

export const client = new ApolloClient({
    link,
    cache: new InMemoryCache()
  });

const UPLOAD = gql`
  mutation($file: Upload!) {
    upload(file: $file) {
      name
    }
  }
`

class PartImageClass extends Component {
    state = {
        image: null
    }

    onImageChange = event => {
        console.log(event.target.files);
    
        this.setState({
          image: event.target.files[0]
        })
      }
    
      onSubmit = e => {
        e.preventDefault();
    
        client
          .mutate({
            mutation: UPLOAD,
            variables: {
              file: this.state.image
            }
          })
          .then(res => {
            console.log(res)
          })
          .catch(err => {
            console.error(err)
          })
      }
    
      render() {
        return (
          <ApolloProvider client={client}>
            <form onSubmit={this.onSubmit}>
              <input
                type="file"
                name="files"
                onChange={this.onImageChange}
                alt="image"
              />
              <br />
              <button type="submit">Send</button>
            </form>
          </ApolloProvider>
        );
      }
    }

export default PartImageClass
