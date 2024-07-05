interface FetchObject {
    url: string;
    headers: { [key: string]: string };
  }
  
export default function generateFetchFromCurl(cURL: string) {
    const curlArr = cURL.split("\\")
    var ftch: FetchObject = { url: '', headers: {} }
    const headersRegex = /-H '([^']+)'/g;
    curlArr.map((t) => {
      if (t.includes("curl")) {
        ftch.url = t.trim().split(' ')[1].split("'")[1];
      }
      else {
        const regex = /'(.*?)'/g;
        const fnd = t.match(regex)
        if (fnd) {
          const [key, value] = fnd[0].split("'")[1].split(":").map(part => part.trim());
          ftch.headers[`${key}`] = value
        }
      }
    })
    return ftch
  }