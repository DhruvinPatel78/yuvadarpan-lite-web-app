import { useSelector } from "react-redux";

export const UseRedux = () => {
  const {
    auth,
    surname,
    region,
    state,
    samaj,
    loading,
    district,
    country,
    city,
    role,
  } = useSelector((state) => ({
    loading: state.auth.loading,
    auth: state.auth,
    surname: state.location.surname,
    region: state.location.region,
    samaj: state.location.samaj,
    state: state.location.state,
    city: state.location.city,
    district: state.location.district,
    country: state.location.country,
    role: state.location.role,
  }));
  return {
    auth,
    surname,
    region,
    state,
    samaj,
    district,
    loading,
    country,
    city,
    role,
  };
};
