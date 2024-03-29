/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/t2FzPqLEgx2
 */
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import axios from "axios"
import { AppCard } from "./AppCard"
import { Loader2Icon } from "lucide-react"

const API_ENDPOINT = `http://${import.meta.env.VITE_API_ENDPOINT as string}:1337`

type Deployment = [id: string, status:string];

export function Landing() {
  const [repoUrl, setRepoUrl] = useState("");
  const [uploadId, setUploadId] = useState("");
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [fetchingData, setFetchingData] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deployed, setDeployed] = useState(false);

  useEffect(function onMount() {
    async function fetchDeployments() {
      setFetchingData(true);
      const res = await axios.get(`${API_ENDPOINT}/apps`);
      const appsList: Deployment[] = Object.entries<string>(res.data.apps);
      setDeployments(appsList.reverse());
      setFetchingData(false);
    }

    fetchDeployments();
  }, []);

  async function onClickHandler() {
    setUploading(true);

    try {
      const uploadRes = await axios.post(`${API_ENDPOINT}/upload`, {
        repoUrl: repoUrl
      });

      setUploadId(uploadRes.data.id);
      setUploading(false);
  
      const interval = setInterval(async () => {
        const statusRes = await axios.get(`${API_ENDPOINT}/${uploadRes.data.id}/status`);
  
        if (statusRes.data.status === "deployed") {
          clearInterval(interval);
          setUploadId("");
          setRepoUrl("");
          setDeployed(true);
          setDeployments([[uploadRes.data.id, "deployed"], ...deployments]);
        }
      }, 3000)
    } catch (err) {
      console.error(err);
      setUploading(false);
    }
  }

  return (
    <main className="w-full h-full grid grid-cols-[1fr_2fr] min-h-screen bg-gray-50 dark:bg-gray-900 p-4 max-w-[1440px] border border-slate-200 m-auto">
      <Card className="relative w-full max-w-md flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <p className="absolute top-6 left-6 font-mono text-2xl">deplr</p>
        { fetchingData && <Loader2Icon className="absolute top-6 right-6 w-8 h-8 animate-spin" /> }
        <CardHeader>
          <CardTitle className="text-xl">Deploy React app</CardTitle>
          <CardDescription>Enter the URL of your GitHub repository to deploy it</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 min-w-[320px]">
            <div className="space-y-2">
              <Label htmlFor="github-url">GitHub Repository URL</Label>
              <Input
                onChange={(e) => {
                  setRepoUrl(e.target.value);
                }} 
                placeholder="https://github.com/username/repo" 
              />
            </div>
            <Button 
              onClick={onClickHandler} 
              disabled={uploadId !== "" || uploading} 
              className="w-full" type="submit">
                {uploadId ? `Deploying (${uploadId})` : uploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-col items-center overflow-auto bg-gray-50 dark:bg-gray-900 pt-8 pb-20">
        { deployments.map(([id, status]) => {
          return <AppCard key={id} appId={id} appStatus={status} />
        })}
      </div>
    </main>
  )
}
