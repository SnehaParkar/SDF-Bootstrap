import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "../store/Store";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { RootState } from "../store/Store";
import { setIntendedPath } from "../store/verificationSlice";


function AppWrapper({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const isVerified = useSelector((state: RootState) => state.verification.isVerified);

  useEffect(() => {
    if (router.pathname === "/verify") return;
    if (!isVerified) {
      dispatch(setIntendedPath(router.asPath));
      router.replace("/verify");
    }
  }, [router.pathname, isVerified, dispatch]);

  return <Component {...pageProps} />;
}


export default function App(props: AppProps) {

  return (
    <Provider store={store}>
      <AppWrapper {...props} />
    </Provider>
  );
}
