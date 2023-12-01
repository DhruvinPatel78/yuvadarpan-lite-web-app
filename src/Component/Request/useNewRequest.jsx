import { useEffect, useState } from "react";
import { updateDoc, collection, getDocs, query, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { NotificationData } from "../Common/notification";

const useNewRequest = () => {
  const [requestInfoModel, setRequestInfoModel] = useState(false);
  const [requestData, setRequestData] = useState(null);
  const [requests, setRequests] = useState([]);
  const { notification, setNotification } = NotificationData();

  useEffect(() => {
    handleRequestList();
  }, []);

  const requestInfoModalOpen = (userInfo) => {
    setRequestInfoModel(true);
    setRequestData(userInfo);
  };
  const requestInfoModalClose = () => {
    setRequestInfoModel(false);
  };
  const handleRequestAccept = (data) => {
    try {
      updateDoc(doc(db, "users", data.id), {
        active: true,
      });
      handleRequestList();
      setNotification({ type: "success", message: "Success !" });
    } catch (e) {
      console.log("error => ", e);
    }
  };
  const handleRequestList = () => {
    const ref = query(collection(db, "users"));
    getDocs(ref).then((res) => {
      setRequests(
        res.docs
          .map((doc) => ({ ...doc.data(), id: doc.id }))
          .filter((data) => !data.active),
      );
    });
  };
  return {
    requestInfoModel,
    requestData,
    requests,
    notification,
    action: {
      requestInfoModalOpen,
      requestInfoModalClose,
      handleRequestAccept,
    },
  };
};

export default useNewRequest;
