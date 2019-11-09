package main

import (
  "io/ioutil"
	"net/http"
  "regexp"
  "log"
  "os"
  "strings"
  "fmt"
)

func copyHeader(dst, src http.Header) {
  for k, vv := range src {
    for _, v := range vv {
      dst.Add(k, v)
    }
  }
}

var HeadTag = regexp.MustCompile("<head>")
const NewHead = `<head>
<script src="/share/foneworx.js"></script>
`

func Handler(w http.ResponseWriter, r *http.Request) {
  r.URL.Scheme = "https"
  r.URL.Host = "www.feisworx.com"
  r.Host = "www.feisworx.com"
  
  resp, err := http.DefaultTransport.RoundTrip(r)
  if err != nil {
    http.Error(w, err.Error(), http.StatusServiceUnavailable)
    return
  }
  defer resp.Body.Close()
  
  body, err := ioutil.ReadAll(resp.Body)
  if err != nil {
    http.Error(w, err.Error(), http.StatusServiceUnavailable)
    return
  }
  
  contentType := resp.Header.Get("Content-Type")
  tamperBody := body
  if strings.HasPrefix(contentType, "text/html") {
  	tamperBody = HeadTag.ReplaceAll(body, []byte(NewHead))
  }
  
  copyHeader(w.Header(), resp.Header)
  w.Header().Set("Content-Length", fmt.Sprintf("%d", len(tamperBody)))
  w.WriteHeader(resp.StatusCode)
  w.Write(tamperBody)
}

func main() {
	http.HandleFunc("/", Handler)
	http.Handle("/share/", http.StripPrefix("/share/", http.FileServer(http.Dir("static/"))))
	http.Handle("/images/", http.StripPrefix("/images/", http.FileServer(http.Dir("static/"))))

  port := os.Getenv("PORT")
  if port == "" {
    port = "8080"
    log.Printf("Defaulting to port %s", port)
  }

  log.Printf("Listening on port %s", port)
  log.Fatal(http.ListenAndServe(fmt.Sprintf(":%s", port), nil))
}

