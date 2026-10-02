import React from "react";
import { Navigate } from "react-router-dom";
import { Box } from "@mui/material";
import Header from "../../Component/Header";
import ContainerPage from "../../Component/Container";
import { useSelector } from "react-redux";
import { isRegularUser } from "../../util/util";
import FullPageLoader from "../../Component/Common/FullPageLoader";

const ConnectSamaj = () => {
  const { user, familyIdExists } = useSelector((state) => state.auth);

  if (!isRegularUser(user?.role)) {
    return <Navigate to="/" replace />;
  }
  if (familyIdExists === null) {
    return <FullPageLoader />;
  }
  if (familyIdExists) {
    return <Navigate to="/" replace />;
  }

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
          <p className="text-base sm:text-lg leading-relaxed text-primary form-lang-gu">
            ડિજિટલ યુવદર્પણ ઉપયોગમાં લેવા માટે યુવદર્પણ પુસ્તક મેળવવું જરૂરી છે.
          </p>
        </div>
      </ContainerPage>
    </Box>
  );
};

export default ConnectSamaj;
