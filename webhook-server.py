#!/usr/bin/env python3
"""
Простой webhook сервер для автоматического деплоя
Запускать: python3 webhook-server.py
"""

import subprocess
import json
import hmac
import hashlib
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import os

WEBHOOK_SECRET = os.environ.get('WEBHOOK_SECRET', 'change-this-secret')
DEPLOY_SCRIPT = os.environ.get('DEPLOY_SCRIPT', '/webhook-deploy.sh')
PROJECT_DIR = os.environ.get('PROJECT_DIR', '/project')
PORT = int(os.environ.get('PORT', 9000))


class WebhookHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length)
        
        # Проверка подписи (для GitHub)
        signature = self.headers.get('X-Hub-Signature-256', '')
        if signature:
            expected_signature = 'sha256=' + hmac.new(
                WEBHOOK_SECRET.encode(),
                body,
                hashlib.sha256
            ).hexdigest()
            if not hmac.compare_digest(signature, expected_signature):
                self.send_response(401)
                self.end_headers()
                self.wfile.write(b'Invalid signature')
                return
        
        try:
            payload = json.loads(body.decode())
            event = self.headers.get('X-GitHub-Event', 'push')
            
            # Запускаем деплой только при push в main/master
            if event == 'push':
                ref = payload.get('ref', '')
                if 'refs/heads/main' in ref or 'refs/heads/master' in ref:
                    self.log_message('Triggering deployment...')
                    # Запускаем деплой в фоне
                    subprocess.Popen([
                        'bash', '-c', 
                        f'cd {PROJECT_DIR} && bash {DEPLOY_SCRIPT}'
                    ], 
                    stdout=subprocess.DEVNULL, 
                    stderr=subprocess.DEVNULL)
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({'status': 'deployment started'}).encode())
                    return
        
        except Exception as e:
            self.log_error(f'Error: {e}')
        
        self.send_response(200)
        self.end_headers()
        self.wfile.write(b'OK')
    
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()
        self.wfile.write(b'<h1>Webhook Server</h1><p>POST to /webhook to trigger deployment</p>')
    
    def log_message(self, format, *args):
        print(f"[{self.address_string()}] {format % args}")


if __name__ == '__main__':
    server = HTTPServer(('0.0.0.0', PORT), WebhookHandler)
    print(f'Webhook server running on port {PORT}')
    print(f'Set WEBHOOK_SECRET environment variable for security')
    server.serve_forever()
