import { redirect } from "next/navigation";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!);

async function Quiz({
  id,
  searchParams,
}: {
  id: string;
  searchParams: { show?: string };
}) {
  // Get the quiz from the database
  // More information in the README.md file
  let answers = await sql`
  SELECT
    q.quiz_id,
    q.title AS quiz_title,
    q.description AS quiz_description,
    q.question_text AS quiz_question,
    a.answer_id,
    a.answer_text,
    a.is_correct
  FROM quizzes AS q
  JOIN answers AS a ON q.quiz_id = a.quiz_id
  WHERE q.quiz_id = ${id};
  `;
  // SELECT is the keyword used to select data from a database.
  // FROM is the table we are selecting from. In this case, we are selecting from the quizzes table.
  // JOIN is joining two tables together. In this case, we are joining the quizzes table with the answers table.
  // WHERE is a condition that we are using to filter the results. In this case, we are filtering the results to only include the quiz with the id that matches the id in the URL.

  // The result of the query is an array of objects. Each object represents a row in the database. The properties of the object are the columns in the database.
  return (
    <div className="flex flex-col text-center items-center mt-12">
      <h1 className="text-4xl text-gray-100 font-bold mb-2">
        {answers[0].quiz_title}
      </h1>
      <p className="text-2xl text-gray-100 mb-8">
        {answers[0].quiz_description}
      </p>
      <p className="text-xl font-semibold mb-8">{answers[0].quiz_question}</p>
      <ul>
        {answers.map((answer) => (
          <li key={answer.answer_id}>
            <p className="text-yellow-300 p-3">
              {answer.answer_text}
              {searchParams.show === "true" && answer.is_correct && " ✅"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function QuizPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { show?: string };
}) {
  return (
    <section className="flex flex-col items-center">
      <Quiz id={params.id} searchParams={searchParams} />
      <form
        action={async () => {
          "use server";
          redirect(`/quiz/${params.id}?show=true`);
        }}
      >
        <button className="bg-gray-500 border-2 border-gray-200 hover:bg-blue-700 rounded p-2 mt-8 transition-all">
          Show Answer
        </button>
      </form>
    </section>
  );
}

// use server will update the url in the browser to the url that is passed in as an argument. In this case, it will update the url to /quiz/1?show=true.
// this replaces having to create a api endpoint and then redirecting to that endpoint.
