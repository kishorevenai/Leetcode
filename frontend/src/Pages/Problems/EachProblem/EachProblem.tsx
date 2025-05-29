import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetProblemByIdQuery } from "../../../feature/problems/problemApiSlice";
import type { ProblemDetail } from "../../../types/ProblemTypes";
import { Button, Splitter } from "antd";
import CustomTypography from "../../../components/Typography";
import { Badge } from "antd";
import { Editor } from "@monaco-editor/react";
import { useSubmitCodeMutation } from "../../../feature/problems/problemApiSlice";

const EachProblem = () => {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("// Write your code here");
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };
  const { id } = useParams();

  const [
    submitCode,
    {
      data: codeSubmissionData,
      isLoading: codeSubmissionLoading,
      isError: codeSubmissionError,
      isSuccess: codeSubmissionSuccess,
      error: codeSubmissionErrorDetails,
    },
  ] = useSubmitCodeMutation();

  const handleCodeSubmission = async () => {
    try {
      const response = await submitCode({
        code,
        language,
      }).unwrap();

      console.log("Code submitted successfully:", response);
      console.log("Submission successful:", response);
    } catch (err) {
      console.error("Submission failed:", err);
    }
  };

  const {
    data: problemDetails,
    isLoading,
    isSuccess,
    isError,
  } = useGetProblemByIdQuery(id, {
    selectFromResult: ({ data, ...rest }) => ({
      data: data as ProblemDetail | undefined,
      ...rest,
    }),
  });

  useEffect(() => {
    if (isSuccess) {
      setCode(
        problemDetails?.ProblemDetail?.starterCode.code ||
          "// Write your code here"
      );
    }
  }, [id, isSuccess]);

  let descriptionPannel = null;
  let solvePannel = null;

  if (isLoading) {
    (descriptionPannel = ""), (solvePannel = "Failed to fetch description");
  } else if (isError) {
    (descriptionPannel = "Failed to fetch description"),
      (solvePannel = "Failed to fetch description");
  } else if (isSuccess) {
    console.log("Problem details:", problemDetails);
    // Prepare the description panel and solve panel
    descriptionPannel = (
      <div
        style={{
          margin: "10px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CustomTypography
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "30px",
            color: "grey",
          }}
        >
          1. {problemDetails?.title}
        </CustomTypography>
        <Badge
          count={problemDetails?.difficulty}
          showZero
          color={
            problemDetails?.difficulty === "EASY"
              ? "#237804" // dark green
              : problemDetails?.difficulty === "MEDIUM"
              ? "#ad8b00" // dark yellow/orange
              : "#cf1322" // red for HARD
          }
          style={{ marginBottom: "20px", fontSize: "10px" }}
        />

        <CustomTypography
          style={{
            fontSize: "15px",
            fontWeight: "bold",
            marginBottom: "30px",
            color: "grey",
          }}
        >
          {problemDetails?.ProblemDetail?.description}
        </CustomTypography>

        <div>
          {problemDetails?.ProblemDetail?.examples.map((constraint, index) => (
            <div
              style={{
                marginTop: "30px",
                display: "flex",
              }}
            >
              <CustomTypography
                key={index}
                style={{
                  fontSize: "15px",
                  marginBottom: "10px",
                  color: "grey",
                }}
              >
                Example {index + 1}
              </CustomTypography>
              <CustomTypography
                style={{
                  fontSize: "15px",
                }}
              >
                Input: {constraint.input}
              </CustomTypography>

              <CustomTypography
                style={{
                  fontSize: "15px",
                }}
              >
                Output: {constraint.output}
              </CustomTypography>
            </div>
          ))}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "30px",
              width: "40%",
            }}
          >
            {problemDetails?.ProblemDetail?.constraints.map((constraint) => (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "fit",
                  marginTop: "10px",
                  padding: "2px",
                  border: "1px solid #d9d9d9",
                  borderRadius: "5px",
                  backgroundColor: "#f0f0f0",
                }}
              >
                <CustomTypography style={{ fontSize: "12px", color: "grey" }}>
                  {constraint}
                </CustomTypography>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

    solvePannel = (
      <div
        style={{
          position: "relative",
          height: "100%",
        }}
      >
        {/* Language Dropdown in top-right corner */}
        {/* <select
          value={language}
          onChange={handleLanguageChange}
          style={{
            position: "absolute",
            right: "0px",
            top: "0px",
            zIndex: 1,
            background: "#1e1e1e",
            color: "#fff",
            border: "1px solid #555",
            borderRadius: "4px",
            padding: "4px",
          }}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
        </select> */}

        <Editor
          height="100%"
          language={language}
          value={problemDetails?.ProblemDetail?.starterCode.code}
          theme="vs-dark"
          onChange={(value) => setCode(value || "")}
          options={{
            minimap: { enabled: false },
          }}
        />
      </div>
    );
  }

  let testContent;
  let resultStatus = null;
  if (codeSubmissionLoading) {
    testContent = (
      <CustomTypography style={{ color: "grey" }}>
        Running tests...
      </CustomTypography>
    );
  } else if (codeSubmissionError) {
    testContent = (
      <CustomTypography style={{ color: "red" }}>
        Error: {codeSubmissionErrorDetails?.data?.message || "Unknown error"}
      </CustomTypography>
    );
  } else if (codeSubmissionSuccess) {
    const parsedJson = JSON.parse(codeSubmissionData?.result.output);
    resultStatus = parsedJson.every((testResult) => testResult.passed);

    testContent = parsedJson.map((testResult, index) => (
      <div
        style={{
          borderRadius: "5px",
          padding: "10px",
          border: "1px solid grey",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <div
          style={{
            width: "5px",
            height: "5px",
            backgroundColor: testResult.passed ? "green" : "red",
            borderRadius: "50%",
          }}
        ></div>
        <CustomTypography
          style={{
            color: "white",
          }}
          key={index}
        >
          <p>Case {index + 1}</p>
        </CustomTypography>
      </div>
    ));
  } else {
    testContent = (
      <CustomTypography style={{ color: "grey" }}>
        Click "Run" to execute your code and see the results.
      </CustomTypography>
    );
  }

  return (
    <div className="h-screen">
      <Splitter
        style={{
          gap: "2px",
          height: "100%",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Splitter.Panel
          defaultSize="40%"
          min="20%"
          max="70%"
          style={{ backgroundColor: "#E5E4E2", padding: "16px" }} // ← your desired background color
        >
          {descriptionPannel}
        </Splitter.Panel>

        <Splitter.Panel>
          <Splitter
            style={{
              gap: "2px",
            }}
            layout="vertical"
          >
            <Splitter.Panel
              defaultSize={"80%"}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "10px",
              }}
            >
              {solvePannel}
            </Splitter.Panel>
            <Splitter.Panel
              style={{
                backgroundColor: "#D3D3D3",
                borderRadius: "10px",
                padding: "5px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
              }}
            >
              <div
                style={{
                  gap: "10px",
                }}
                className="flex flex-col justify-start items-start"
              >
                {resultStatus === true && (
                  <CustomTypography
                    style={{
                      color: "green",
                      fontWeight: "bold",
                      fontSize: "16px",
                    }}
                  >
                    Passed
                  </CustomTypography>
                )}

                {resultStatus === false && (
                  <CustomTypography
                    style={{
                      color: "red",
                      fontWeight: "bold",
                      fontSize: "16px",
                    }}
                  >
                    Failed
                  </CustomTypography>
                )}

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                  }}
                >
                  {testContent}
                </div>
              </div>
              <Button type="primary" style={{}} onClick={handleCodeSubmission}>
                Run
              </Button>
            </Splitter.Panel>
          </Splitter>
        </Splitter.Panel>
      </Splitter>
    </div>
  );
};

export default EachProblem;
