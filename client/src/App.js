import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Switch, Route } from "react-router-dom";
import { Redirect } from "react-router-dom";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import * as AuthAction from "./store/auth";
import Home from "./components/Home/Home";
import MyProfile from "./components/Profile/MyProfile";
import Upload from "./components/Upload/Upload";
import EditProfile from "./components/Profile/EditProfile";
import SoloPost from "./components/SoloPost/SoloPost";
import Profile from "./components/Profile/Profile";
import ProfileImgUpload from "./components/Upload/ProfileImgUpload";
import ExplorePage from "./components/ExplorePage/ExplorePage";
import Welcome from "./components/Welcome/Welcome";
import LogInPage from "./components/Login/NewLogin";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const needLogin = useSelector((state) => state.auth.id);

  return (
    <>
      <Route
        {...rest}
        render={(props) =>
          needLogin ? <Component {...props} /> : <Redirect to="/login" />
        }
      />
    </>
  );
};

function App() {
  const [fetchWithCSRF, setFetchWithCSRF] = useState(() => fetch);
  const dispatch = useDispatch();
  const loadCurrentUser = () => dispatch(AuthAction.loadUser());

  useEffect(() => {
    loadCurrentUser();
    // eslint-disable-next-line
  }, []);

  //   useEffect(() => {
  //     loadCurrentUser();
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, []);

  //   useEffect(() => {
  //     async function restoreCSRF() {
  //       const response = await fetch("/api/csrf/restore", {
  //         method: "GET",
  //         credentials: "include",
  //       });
  //       if (response.ok) {
  //         const authData = await response.json();
  //         console.log(authData);
  //         setFetchWithCSRF(() => {
  //           return (resource, init) => {
  //             if (init.headers) {
  //               init.headers["X-CSRFToken"] = authData.csrf_token;
  //             } else {
  //               init.headers = {
  //                 "X-CSRFToken": authData.csrf_token,
  //               };
  //             }
  //             return fetch(resource, init);
  //           };
  //         });
  //       }
  //     }
  //     restoreCSRF();
  //     dispatch(setCsrfFunc(fetchWithCSRF));
  //   }, []);

  //   useEffect(() => {
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, []);

  return (
    <>
      <Switch>
        <Route path="/login" exact={true} component={LogInPage} />
        <Route path="/signup" exact={true} component={Signup} />
        <PrivateRoute path="/" exact={true} component={Home} />
        <PrivateRoute path="/upload" exact={true} component={Upload} />
        <PrivateRoute
          path="/profile/:id/edit"
          exact={true}
          component={EditProfile}
        />
        <PrivateRoute path="/post/:id" exact={true} component={SoloPost} />
        <PrivateRoute path="/profile/:id" exact={true} component={Profile} />
        <PrivateRoute
          path="/my/profile/:id"
          exact={true}
          component={MyProfile}
        />
        <PrivateRoute
          path="/profile/img/:id/upload"
          exact={true}
          component={ProfileImgUpload}
        />
        <PrivateRoute path="/explore" exact={true} component={ExplorePage} />
        <PrivateRoute path="/welcome" exact={true} component={Welcome} />
      </Switch>
    </>
  );
}

export default App;
