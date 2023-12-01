import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
} from "firebase/firestore";
import { db } from "../../firebase";

const useNewRequest = () => {
  const [requestInfoModel, setRequestInfoModel] = useState(false);
  const [requestData, setRequestData] = useState(null);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const ref = query(collection(db, "users"));
    getDocs(ref).then((res) => {
      setRequests(
        res.docs.map((doc) => doc.data()).filter((data) => !data.active),
      );
    });
  }, []);

  const requestInfoModalOpen = (userInfo) => {
    setRequestInfoModel(true);
    setRequestData(userInfo);
  };
  const requestInfoModalClose = () => {
    setRequestInfoModel(false);
  };
  return {
    requestInfoModel,
    requestData,
    requests,
    action: {
      requestInfoModalOpen,
      requestInfoModalClose,
    },
  };
};

export default useNewRequest;
