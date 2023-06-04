#!/usr/bin/env python3

# Start a web server
class Program(object):
  def __init__(self):
    pass

  def run(self):
    import http.server
    import socketserver

    port = 8000

    Handler = http.server.SimpleHTTPRequestHandler
    Handler.extensions_map.update({
          ".js": "application/javascript",
    });

    httpd = socketserver.TCPServer(("", port), Handler)

    print('Created')
    print(f'Connect with\n  http://localhost:{port}')
    httpd.serve_forever()

import os
import sys

def main():
  # get this script's folder
  here = sys.path[0]
  print('Start a localhost web server from\n  {}'.format(here))

  # cd to here
  os.chdir(here)

  program = Program()
  program.run()

if __name__ == "__main__":
  main()
