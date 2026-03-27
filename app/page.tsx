import UploadBox from "@/components/UploadBox";

export default function Home() {
  return (
    <main style={{minHeight: '100vh', background: '#000', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px'}}>
      
      <div style={{textAlign: 'center', marginBottom: '40px'}}>
        <h1 style={{fontSize: '48px', fontWeight: 'bold', color: '#22d3ee', marginBottom: '16px'}}>
          ⚡ ClipForge
        </h1>
        <p style={{color: '#71717a', fontSize: '18px'}}>
          AI-powered gaming clip editor
        </p>
      </div>

      <UploadBox />

      <div style={{display: 'flex', gap: '16px', marginTop: '32px'}}>
        <button style={{background: '#22d3ee', color: '#000', fontWeight: 'bold', padding: '12px 32px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '16px'}}>
          Upload Clip
        </button>
        <button style={{border: '2px solid #22d3ee', color: '#22d3ee', fontWeight: 'bold', padding: '12px 32px', borderRadius: '12px', background: 'transparent', cursor: 'pointer', fontSize: '16px'}}>
          View Plans
        </button>
      </div>

    </main>
  );
}