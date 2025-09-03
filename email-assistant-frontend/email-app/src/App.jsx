import { useState } from 'react'
import './App.css'
import { Button } from './components/ui/button'
import { Textarea } from './components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Copy } from "lucide-react"
import axios from 'axios'

function App() {
  const [emailcontent, setEmailcontent] = useState("")
  const [tone, setTone] = useState("")
  const [generatedContent, setGeneratedContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [copy,setcopy]=useState(false);

  const handleCopy = () => {
    setcopy(false);
    navigator.clipboard.writeText(generatedContent)
    setcopy(true);
  }

  const handlesubmit = async () => {
    if (!emailcontent) {
      alert("Email Content is required!")
      return
    }

    setLoading(true)
    setError("")

    try {
      const res = await axios.post("http://localhost:9090/api/email/generate", {
        emailContent: emailcontent, 
        tone: tone,
      })

      setGeneratedContent(
        typeof res.data === "string" ? res.data : JSON.stringify(res.data)
      )
    } catch (err) {
      setError("Failed to generate email reply. Please try again")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full h-full flex justify-center  items-center p-20">
      <div className="grid w-6xl ite gap-5">
        <h2 className="font-bold text-2xl text-center p-5">Email Assistant APP</h2>

        {/* Input */}
        <Textarea
          placeholder="Type your Email here."
          value={emailcontent}
          onChange={(e) => setEmailcontent(e.target.value)}
        />

        {/* Tone Selector */}
        <Select value={tone} onValueChange={(value) => setTone(value)}>
          <SelectTrigger className="w-full justify-center">
            <SelectValue placeholder="Tone (Optional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Professional">Professional</SelectItem>
            <SelectItem value="Friendly">Friendly</SelectItem>
            <SelectItem value="Casual">Casual</SelectItem>
          </SelectContent>
        </Select>

        {/* Generate Button */}
        <Button disabled={loading} onClick={handlesubmit}>
          {loading ? "Generating..." : "Generate Email Reply"}
        </Button>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Generated Output */}
        {generatedContent && (
          <div className="relative">
            <Textarea
              value={generatedContent}
              readOnly
              className="pr-12"
              rows={6}
            />
            <Button
             
              variant="outline"
              className="absolute top-2 right-2 h-15  flex-col"
              onClick={handleCopy}
            >
              <p className='text-sm text-gray-600'>{copy?"copied":"copy"}</p><Copy className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
