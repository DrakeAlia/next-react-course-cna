import Link from "next/link";
import postgres from "postgres";
import QuizForm from "./quiz-form";

const sql = postgres(process.env.POSTGRES_URL!);

// Create a quiz type to represent the data from the database
// quiz_id: This property is of type number. It likely represents a
// unique identifier for each quiz.
// title: This property is of type string. It likely represents the
// title or name of the quiz.
type Quiz = {
  quiz_id: number;
  title: string;
};

async function Quizzes() {
  // get all the quizzes from the database
  const quizzes: Quiz[] = await sql`
  SELECT * FROM quizzes
  `;
  // console.log(quizzes);

  return (
    <ul>
      {quizzes.map((quiz) => (
        <li key={quiz.quiz_id} className="underline">
          <Link href={`/quiz/${quiz.quiz_id}`}>{quiz.title}</Link>
        </li>
      ))}
    </ul>
  );
}

// The Home component will render the list of quizzes and a form to create new quizzes.
export default function Home() {
  return (
    <section className="flex flex-col items-center text-center mt-2 py-5 mx-auto">
      <h1 className="text-2xl font-bold p-2 mb-4">All Quizzes</h1>
      <Quizzes />
      <QuizForm />
    </section>
  );
}






// Hardcoded way of rendering the list of quizzes

// export default function Home() {
//   return (
//     <section>
//       <h1>All Quizzes</h1>
//       <ul>
//         <li>
//           <Link href="/quiz/1">Quiz 1</Link>
//         </li>
//         <li>
//           <Link href="/quiz/2">Quiz 2</Link>
//         </li>
//         <li>
//           <Link href="/quiz/3">Quiz 3</Link>
//         </li>
//       </ul>
//     </section>
//   );
// }