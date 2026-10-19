import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:resident_mobile/app.dart';

void main() {
  testWidgets('Resident login screen smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const ResidentApp());

    expect(find.text('Log in'), findsOneWidget);
    await tester.scrollUntilVisible(
      find.text('Continue as Guest'),
      200,
      scrollable: find.byType(Scrollable).first,
    );
    expect(find.text('Continue as Guest'), findsOneWidget);
    expect(find.text('FireWatch 69'), findsWidgets);
  });
}
