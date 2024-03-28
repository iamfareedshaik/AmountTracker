import RootNavigator from "./routes/routes";
import { TokenProvider } from "./app/context/TokenContext";
export default function App() {
  return (
    <TokenProvider>
        <RootNavigator />
    </TokenProvider>
  );
}
