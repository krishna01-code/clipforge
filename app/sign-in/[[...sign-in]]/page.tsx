import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0a0f 0%, #0d1117 50%, #0a0f1e 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <SignIn />
    </div>
  );
}
```

Ctrl+S dabao! Phir terminal mein:
```
git add .
git commit -m "fix: remove invalid SignedOut import"
git push