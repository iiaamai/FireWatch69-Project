import 'package:flutter_test/flutter_test.dart';
import 'package:responder_mobile/app.dart';

void main() {
  testWidgets('Responder login screen smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const ResponderApp());

    expect(find.text('Responder sign in'), findsOneWidget);
    expect(find.text('Sign in'), findsOneWidget);
  });
}
