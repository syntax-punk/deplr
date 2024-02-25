import { Label } from "@radix-ui/react-label";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";

interface Props {
  appId: string;
  appStatus: string;
}

const WEBSERVER = import.meta.env.VITE_DEPLR_SERVER as string;

export function AppCard({ appId, appStatus }: Props) {
  return (
    <Card className="w-full max-w-md mt-8">
    <CardHeader>
      <CardTitle className="text-xl">Deployment Status:</CardTitle>
      <CardDescription className="text-lime-700 underline">{appStatus.toLocaleUpperCase()}</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <Label htmlFor="deployed-url">Deployed URL</Label>
        <Input id="deployed-url" readOnly type="url" value={`http://${appId}.${WEBSERVER}:8080`} />
      </div>
      <br />
        <a href={`http://${appId}.${WEBSERVER}:8080`} target="_blank">
          <Button className="w-full" variant="outline">
            Open
          </Button>
        </a>
    </CardContent>
  </Card>
  )
}