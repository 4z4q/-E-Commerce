import { TextField } from "@mui/material";
import { useState } from "react";

interface InputData {
  [key: string]: string;
}

export default function AI() {
  const [inputData, setInputData] = useState<InputData>({
    age: "",
    anaemia: "",
    creatinine_phosphokinase: "",
    diabetes: "",
    ejection_fraction: "",
    high_blood_pressure: "",
    platelets: "",
    serum_creatinine: "",
    serum_sodium: "",
    sex: "",
    smoking: "",
    time: "",
  });

  const [prediction, setPrediction] = useState<string | null>(null);

  const labels: { [key: string]: string } = {
    age: "العمر",
    anaemia: "هل تعاني من فقر الدم؟",
    creatinine_phosphokinase: "إنزيم العضلات",
    diabetes: "هل لديك سكري؟",
    ejection_fraction: "كفاءة ضخ القلب",
    high_blood_pressure: "هل تعاني من ارتفاع ضغط الدم؟",
    platelets: "عدد الصفائح الدموية",
    serum_creatinine: "نسبة الكرياتينين في الدم",
    serum_sodium: "مستوى الصوديوم في الدم",
    sex: "الجنس (0: أنثى، 1: ذكر)",
    smoking: "هل أنت مدخن؟",
    time: "مدة المتابعة بالأيام",
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://127.0.0.1:5000/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputData),
      });
      const result = await response.json();
      setPrediction(result.prediction);
    } catch (error) {
      console.error("Error in prediction:", error);
    }
  };

  return (
    <div style={{ direction: "rtl", margin: "20px", padding: "20px" }}>
      {/* <h1>احصل على نتيجة التشخيص</h1> */}
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        {Object.keys(inputData).map((key) => (
          <>
            <label>{labels[key]}</label>
            <TextField
              type="text"
              name={key}
              value={inputData[key]}
              onChange={handleChange}
            />
          </>
        ))}
        <button type="submit">إرسال</button>
      </form>
      {prediction !== null && <div>النتيجة: {prediction === "1" ? "مريض" : "غير مريض"}</div>}
    </div>
  );
}
