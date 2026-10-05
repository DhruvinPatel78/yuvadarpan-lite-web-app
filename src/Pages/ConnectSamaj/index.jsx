import React, { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { Box } from "@mui/material";
import Header from "../../Component/Header";
import ContainerPage from "../../Component/Container";
import { useDispatch, useSelector } from "react-redux";
import { isRegularUser } from "../../util/util";
import FullPageLoader from "../../Component/Common/FullPageLoader";
import { Button } from "../../Component/UI";
import {
  createAccessPayment,
  getAccessPrice,
  getPaymentStatus,
} from "../../util/paymentApi";
import { setFamilyIdExists } from "../../store/authSlice";
import { getAllFamilyIdData } from "../../util/getAPICall";
import {
  NotificationData,
  NotificationSnackbar,
} from "../../Component/Common/notification";

const ConnectSamaj = () => {
  const { user, familyIdExists } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { notification, setNotification } = NotificationData();
  const [paymentEnabled, setPaymentEnabled] = useState(null);
  const [priceInr, setPriceInr] = useState(100);
  const [paying, setPaying] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const verifyTried = useRef("");

  useEffect(() => {
    getAccessPrice()
      .then((data) => {
        setPaymentEnabled(Boolean(data?.enabled));
        if (Number(data?.amountInr) > 0) {
          setPriceInr(Number(data.amountInr));
        }
      })
      .catch(() => {
        setPaymentEnabled(false);
      });
  }, []);

  useEffect(() => {
    if (paymentEnabled !== true) {
      return;
    }
    const merchantOrderId = String(searchParams.get("payment") || "").trim();
    if (!merchantOrderId || verifyTried.current === merchantOrderId) {
      return;
    }
    verifyTried.current = merchantOrderId;
    setVerifying(true);
    getPaymentStatus(merchantOrderId)
      .then(async (result) => {
        if (result?.status === "COMPLETED" || result?.familyIdExists) {
          dispatch(setFamilyIdExists(true));
          dispatch(getAllFamilyIdData);
          setNotification({
            type: "success",
            message: "Payment successful. Access unlocked.",
          });
          setSearchParams({}, { replace: true });
          navigate("/", { replace: true });
          return;
        }
        setNotification({
          type: "error",
          message:
            result?.status === "FAILED"
              ? "Payment failed. Please try again."
              : "Payment is still pending. Tap Pay again after completing it.",
        });
        setSearchParams({}, { replace: true });
      })
      .catch(() => {
        setNotification({
          type: "error",
          message: "Could not verify payment. Please try again.",
        });
        setSearchParams({}, { replace: true });
      })
      .finally(() => setVerifying(false));
  }, [
    paymentEnabled,
    searchParams,
    setSearchParams,
    dispatch,
    navigate,
    setNotification,
  ]);

  if (!isRegularUser(user?.role)) {
    return <Navigate to="/" replace />;
  }
  if (familyIdExists === null || paymentEnabled === null || verifying) {
    return <FullPageLoader />;
  }
  if (familyIdExists) {
    return <Navigate to="/" replace />;
  }

  const handlePay = async () => {
    if (paying || paymentEnabled !== true) return;
    setPaying(true);
    try {
      const result = await createAccessPayment();
      if (result?.alreadyUnlocked) {
        dispatch(setFamilyIdExists(true));
        dispatch(getAllFamilyIdData);
        navigate("/", { replace: true });
        return;
      }
      if (!result?.redirectUrl) {
        throw new Error("Missing checkout URL");
      }
      window.location.href = result.redirectUrl;
    } catch (error) {
      setNotification({
        type: "error",
        message:
          error?.response?.data?.message ||
          "Could not start PhonePe payment. Please try again.",
      });
      setPaying(false);
    }
  };

  return (
    <Box>
      <Header />
      <ContainerPage className="flex flex-col items-center justify-center min-h-[60vh] py-10">
        <div className="w-full max-w-xl text-center px-4">
          <h1 className="text-2xl sm:text-3xl font-semibold text-primary mb-4 form-lang-gu">
            યુવદર્પણ પુસ્તક મળ્યું નથી?
          </h1>
          <p className="text-base sm:text-lg leading-relaxed text-primary form-lang-gu">
            કૃપા કરીને તમારા સમાજ સાથે સંપર્ક કરો અને યુવદર્પણ પુસ્તક મેળવો.
          </p>
          <p
            className={`text-base sm:text-lg leading-relaxed text-primary form-lang-gu ${
              paymentEnabled ? "mb-8" : ""
            }`}
          >
            ડિજિટલ યુવદર્પણ ઉપયોગમાં લેવા માટે યુવદર્પણ પુસ્તક મેળવવું જરૂરી છે.
          </p>

          {paymentEnabled ? (
            <div className="rounded-2xl border border-line bg-white p-5 sm:p-6 text-left shadow-sm">
              <p className="text-sm font-medium text-mutedText mb-1">
                Digital access
              </p>
              <h2 className="text-xl font-semibold text-primary mb-2">
                Unlock with Family ID
              </h2>
              <p className="text-sm text-mutedText mb-4 leading-relaxed">
                Your Family ID{" "}
                <span className="font-semibold text-primary">
                  {user?.familyId || "—"}
                </span>{" "}
                is not in the access list yet. Pay once to add it and open the
                app.
              </p>
              <div className="flex items-end justify-between gap-3 mb-5">
                <span className="text-sm text-mutedText">Price</span>
                <span className="text-2xl font-semibold text-primary">
                  ₹{priceInr}
                </span>
              </div>
              <Button
                type="button"
                fullWidth
                loading={paying}
                onClick={handlePay}
              >
                Pay ₹{priceInr} with PhonePe
              </Button>
            </div>
          ) : null}
        </div>
      </ContainerPage>
      <NotificationSnackbar notification={notification} />
    </Box>
  );
};

export default ConnectSamaj;
