//
//  ContentView.swift
//  JukeLab
//
//  Created by Noah Zoschke on 12/13/24.
//

import SwiftUI

struct ContentView: View {
  var body: some View {
    ZStack {
      WebView()
    }
    .edgesIgnoringSafeArea(.all)  // screen includes notch and home bar
    .statusBar(hidden: true)
  }
}

#Preview {
  ContentView()
}
