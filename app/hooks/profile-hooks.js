import { useEffect, useState } from 'react';
import { useAuthHoc } from '../config/config';
import _ from 'lodash';
import { useSelector } from 'react-redux';

const UseProfileHook = () => {

  const profile = useSelector(state => state.Auth.profile);

  const [subscriptionData, setSubscriptionData] = useState({});

  const {
    reducerConstants: { },
    actions: { GET_SUBSCRIPTIONS_DATA_API_CALL },
  } = useAuthHoc();


  useEffect(() => {
    if (!_.isEmpty(profile)) {
      GET_SUBSCRIPTIONS_DATA_API_CALL({
        request: {
          payload: {
            userid: profile.id,
            locale: 'en',
          },
        },
        callback: {
          successCallback({ data }) {

            if (data && !_.isEmpty(data?.data?.data)) {
              setSubscriptionData(data.data.data[0]);
            }
          },
          errorCallback(message) {
            console.log('err', message);
          },
        },
      });
    }
  }, [profile]);

  return {
    profile: profile,
    subscriptionData,
  };
};

export default UseProfileHook;
