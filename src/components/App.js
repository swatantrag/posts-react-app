import React from 'react';
import TableStruct from './TableStruct.jsx';
import ReactLoading from 'react-loading';
import "../style.scss";
const BaseURL = 'https://jsonplaceholder.typicode.com/';

class PostLogs extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      postData: [],
      userData: [],
      postList: false,
      postDetail: false,
      userDetail: false,
      postDetailData: {},
      userDetailData: {},
      searchItem: '',
      comments: [],
      selectedRow: {},
      headers: [
        {displayName: 'Id', name: 'id'},
        {displayName: 'Post', name: 'title'},
        {displayName: 'User', name: 'username'}
      ]
    }

    Promise.all([ fetch(BaseURL + 'posts'), fetch(BaseURL + 'users') ]).then(function (responses) {
      return Promise.all(responses.map(function (response) {
        return response.json();
      }));
    })
    .then(data => {
      let posts = data[0];
      for (let i = 0; i < posts.length; i++) {
          posts[i] = {
            ...posts[i], 
            username: data[1].find(el => el.id === posts[i].userId).name,
            user: data[1].find(el => el.id === posts[i].userId)
          }
      }
      this.setState({postData: posts, userData: data[1], postList: true});
    });
  }

  handleRowClick = (row, type) => {
    if (row) {
        if (type === 'title') {
            fetch(BaseURL + 'posts/' + row.id + '/comments')
            .then(res => res.json())
            .then(data => {
              this.setState({postList: false, postDetail: true, userDetail: false, postDetailData: row, comments: data});
            });
        } else if (type === 'username') {
          this.setState({postList: false, postDetail: false, userDetail: true, userDetailData: row});
        }
    }
  }

  render() {
    return (
      <div className="app">
          <div className="container">
              <div className="header">
                  {!this.state.postList && <button type="button" onClick={() => this.setState({ postList: true, postDetail: false, userDetail: false})}>Back</button>}
                  <h2>
                    {this.state.postList && 'POST LIST'}
                    {this.state.postDetail && 'POST DETAIL'}
                    {this.state.userDetail && 'USER DETAIL'}
                  </h2>
              </div>
              <div className="content">
                  {this.state.postList ? 
                      <>
                          <div className="search-wrap">
                              <input type="text" placeholder="Search here" value={this.state.searchItem} onChange={(e) => this.setState({searchItem: e.target.value})} />
                          </div>
                          <TableStruct 
                              content={this.state.postData} 
                              headers={this.state.headers} 
                              searchItem={this.state.searchItem}
                              handleRowClick={this.handleRowClick.bind(this)}    
                          />
                      </> : null}
                  {this.state.postDetail && 
                      <div className="post-wrap">
                          <div className="post-body">
                              <p className="title">{this.state.postDetailData.title}</p>
                              <p><b>Description </b> {this.state.postDetailData.body}</p>
                              <p><b>User: </b> {this.state.postDetailData.username}</p>
                          </div>
                          <div className="comment-wrap">
                              <div className="comment-label">Comments:</div>
                              {this.state.comments.map((comment, index) => {
                                return (
                                  <div className="comment" key={index}>
                                      <p className="comment-name">{comment.name}</p>
                                      <p className="comment-body">{comment.body}</p>
                                      <p className="comment-email"><span>{comment.email}</span></p>
                                  </div>)
                              })}
                          </div>
                      </div>
                  }
                  {this.state.userDetail && 
                      <div className="user-wrap">
                          <p><b>Name:</b>{this.state.userDetailData.user.name}</p>
                          <p><b>Email:</b>{this.state.userDetailData.user.email}</p>
                          <p><b>Phone:</b>{this.state.userDetailData.user.phone}</p>
                          <p><b>Username:</b>{this.state.userDetailData.user.username}</p>
                          <p><b>Website:</b>{this.state.userDetailData.user.website}</p>
                          <p><b>Company:</b></p>
                          <p className="detail">
                              <div>{this.state.userDetailData.user.company.name}</div>
                              <div>{this.state.userDetailData.user.company.catchPhrase}</div>
                              <div>{this.state.userDetailData.user.company.bs}</div>
                          </p>
                          <p><b>Address:</b></p>
                          <p className="detail">
                              <div><b>Suite:</b>{this.state.userDetailData.user.address.suite}</div>
                              <div><b>Street:</b>{this.state.userDetailData.user.address.street}</div>
                              <div><b>City:</b>{this.state.userDetailData.user.address.city}</div>
                              <div><b>Zipcode:</b>{this.state.userDetailData.user.address.zipcode}</div>
                              <div><b>Geo Location:</b>{'Latitue : ' + this.state.userDetailData.user.address.geo.lat}, {'Longitude : ' + this.state.userDetailData.user.address.geo.lng}</div>
                          </p>
                      </div>
                  }
                  {this.state.isLoading && 
                      <ReactLoading type={'bubbles'} color={'#000'} height={'80px'} width={'80px'} />
                  }
              </div>
          </div>
      </div>
    )
  }
} 

export default PostLogs;
