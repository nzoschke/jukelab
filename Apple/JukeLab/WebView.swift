//
//  WebView.swift
//  JukeLab
//
//  Created by Noah Zoschke on 7/18/23.
//

import SwiftUI
import WebKit

var defaultsKey = "WebUrl"

struct WebView: UIViewRepresentable {
  func makeUIView(context: UIViewRepresentableContext<WebView>) -> WKWebView {
    let preferences = WKWebpagePreferences()
    preferences.allowsContentJavaScript = true

    let configuration = WKWebViewConfiguration()
    configuration.defaultWebpagePreferences = preferences
    configuration.applicationNameForUserAgent = "JukePod/1.0"
    configuration.limitsNavigationsToAppBoundDomains = true

    let controller = WKUserContentController()
    controller.add(context.coordinator, name: "handler")
    controller.addScriptMessageHandler(
      context.coordinator, contentWorld: WKContentWorld.page, name: "handlerWithReply")

    configuration.userContentController = controller

    let webView = WKWebView(frame: .zero, configuration: configuration)
    webView.navigationDelegate = context.coordinator
    webView.scrollView.contentInsetAdjustmentBehavior = .never

    // save and load last URL from UserDefaults
    let url =
      UserDefaults.standard.string(forKey: defaultsKey)
      ?? "https://nzoschke.github.io/jukelab/spotify/desktop"

    debugPrint(url)
    DispatchQueue.main.async {
      let req = URLRequest(url: URL(string: url)!)
      webView.load(req)
    }

    return webView
  }

  func updateUIView(_: WKWebView, context _: UIViewRepresentableContext<WebView>) {}

  func makeCoordinator() -> WebCoordinator {
    Coordinator(self)
  }

  typealias UIViewType = WKWebView
}

class WebCoordinator: NSObject, WKNavigationDelegate, WKScriptMessageHandler,
  WKScriptMessageHandlerWithReply
{
  var control: WebView
  var webView: WKWebView?

  init(_ control: WebView) {
    self.control = control

    super.init()
  }

  func userContentController(_: WKUserContentController, didReceive message: WKScriptMessage) {
    self.debugLog("DEBUG WebCoordinator handler message=\(message.body)")
  }

  func userContentController(
    _ userContentController: WKUserContentController, didReceive message: WKScriptMessage,
    replyHandler: @escaping (Any?, String?) -> Void
  ) {
    self.debugLog("DEBUG WebCoordinator handlerWithReply message=\(message.body)")
    replyHandler(nil, "message not found")
  }

  func webView(_ webView: WKWebView, didFinish _: WKNavigation!) {
    self.webView = webView
  }

  func webView(
    _ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction,
    decisionHandler: (WKNavigationActionPolicy) -> Void
  ) {
    if let url = navigationAction.request.url?.absoluteString {
      // don't store spotify.com etc URLs to reload
      if url.contains("jukelab") {
        UserDefaults.standard.set(url, forKey: defaultsKey)
      }
    }
    decisionHandler(.allow)
  }

  func debugLog(_ msg: String) {
    debugPrint(msg)
    let escaped = msg.replacingOccurrences(of: "\"", with: "\\\"")
    DispatchQueue.main.async {
      self.webView!.evaluateJavaScript(
        "window.dispatchEvent(new CustomEvent('log', {detail: {message: \"\(escaped)\"}}))",
        completionHandler: nil)
    }
  }
}
