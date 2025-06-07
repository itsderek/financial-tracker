import { Button } from "@/components/ui/button";

export function DatabaseTester() {
  return (
    <Button variant="outline" onClick={() => console.log("ouch!")}>
      Test that Database!
    </Button>
  );
}

export function InsertTester() {
  const tester = async () => {
    console.log("inside insert");
    try {
      const response = await fetch("http://localhost:8000/sayhi", {
        method: "POST",
      });

      if (response.ok) {
        alert("worked");
      } else {
        alert("failed");
      }
    } catch (error) {
      console.error("error:", error);
      alert("big error");
    }
  };
  return (
    <Button variant="outline" onClick={tester}>
      Posta record
    </Button>
  );
}

export function SelectTester() {
  const tester = async () => {
    console.log("inside select");
    try {
      // const response = await fetch("http://localhost:8000/sayhi", {
      const response = await fetch("http://localhost:8000/get-accounts", {
        method: "GET",
      });

      if (response.ok) {
        alert("worked");
        const data = await response.json();
        console.log("Response JSON: ", data);
      } else {
        alert("failed");
      }
    } catch (error) {
      console.error("error:", error);
      alert("big error");
    }
  };
  return (
    <Button variant="outline" onClick={tester}>
      Select some records
    </Button>
  );
}
