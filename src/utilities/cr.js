const YEAR = new Date().getFullYear();

export default function Cr() {
  return (
    <>
      <div className="copyright">
        {`${YEAR} © ri1ken.`}
        <a
          href="https://twitter.com/Kiokh_"
          target="_blank"
          rel="noopener noreferrer"
        >
          @Kiokh_
        </a>
        . 
        <a
          href="https://github.com/Kiotlin/tama"
          target="_blank"
          rel="noreferrer"
        >
          Github Repository
        </a>
        . 
      </div>
    </>
  );
}
