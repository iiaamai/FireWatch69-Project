import 'package:flutter_test/flutter_test.dart';
import 'package:resident_mobile/app.dart';

void main() {
  testWidgets('Resident entry screen smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const ResidentApp());

    expect(find.text('Sign in as resident'), findsOneWidget);
    expect(find.text('Continue as guest'), findsOneWidget);
  });
}
