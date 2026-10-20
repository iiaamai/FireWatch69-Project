import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Brand colors — docs/brand_kit.txt (keep in sync with resident_mobile).
abstract final class Fw69Colors {
  static const primary = Color(0xFFDC2626);
  static const primaryTint1 = Color(0xFFE35151);
  static const primaryTint2 = Color(0xFFE76767);
  static const primaryShade1 = Color(0xFFB01E1E);
  static const primaryShade2 = Color(0xFF9A1B1B);
  static const primaryTone1 = Color(0xFFCE4538);
  static const primaryTone2 = Color(0xFFBE5949);

  static const neutralBg = Color(0xFFF5F5F7);
  static const neutralSurface = Color(0xFFFFFFFF);
  static const neutralText = Color(0xFF111827);
  static const neutralTextMuted = Color(0xFF374151);
  static const neutralActive = Color(0xFF111827);
  static const neutralOnDark = Color(0xFFFFFFFF);
  static const neutralBorder = Color(0xFFD1D5DB);

  static const alertCriticalBg = Color(0xFFFEF2F2);
  static const alertCriticalBorder = Color(0xFFFCA5A5);
  static const alertCriticalText = Color(0xFF991B1B);
  static const alertHighBg = Color(0xFFFFF7ED);
  static const alertHighBorder = Color(0xFFFDBA74);
  static const alertHighText = Color(0xFF9A3412);
  static const alertMediumBg = Color(0xFFFFFBEB);
  static const alertMediumBorder = Color(0xFFFCD34D);
  static const alertMediumText = Color(0xFF95400E);
  static const alertLowBg = Color(0xFFF9FAFB);
  static const alertLowBorder = Color(0xFFD1D5DB);
  static const alertLowText = Color(0xFF374151);
}

/// Placeholder typography until brand font is chosen (docs/brand_kit.txt).
abstract final class Fw69Fonts {
  /// Web officials app CSS stack (Aptos when installed, else Segoe UI / Roboto).
  static const webCssStackReference =
      'Aptos, Segoe UI, Roboto, system-ui, sans-serif';

  static TextTheme apply(TextTheme base) => GoogleFonts.robotoTextTheme(base);
}

abstract final class Fw69Theme {
  static ThemeData light() {
    final colorScheme = ColorScheme.light(
      primary: Fw69Colors.primary,
      onPrimary: Fw69Colors.neutralOnDark,
      secondary: Fw69Colors.primaryTone1,
      onSecondary: Fw69Colors.neutralOnDark,
      surface: Fw69Colors.neutralSurface,
      onSurface: Fw69Colors.neutralText,
      onSurfaceVariant: Fw69Colors.neutralTextMuted,
      outline: Fw69Colors.neutralBorder,
      error: Fw69Colors.alertCriticalText,
      onError: Fw69Colors.neutralOnDark,
    );

    final theme = ThemeData(
      useMaterial3: true,
      colorScheme: colorScheme,
      scaffoldBackgroundColor: Fw69Colors.neutralBg,
      appBarTheme: const AppBarTheme(
        backgroundColor: Fw69Colors.neutralSurface,
        foregroundColor: Fw69Colors.neutralText,
        elevation: 0,
        scrolledUnderElevation: 0,
        surfaceTintColor: Colors.transparent,
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          backgroundColor: Fw69Colors.primary,
          foregroundColor: Fw69Colors.neutralOnDark,
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: Fw69Colors.neutralText,
          side: const BorderSide(color: Fw69Colors.neutralBorder),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: Fw69Colors.neutralSurface,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: Fw69Colors.neutralBorder),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: Fw69Colors.neutralBorder),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: Fw69Colors.primaryTint2, width: 2),
        ),
      ),
    );

    return theme.copyWith(
      textTheme: Fw69Fonts.apply(theme.textTheme),
      primaryTextTheme: Fw69Fonts.apply(theme.primaryTextTheme),
    );
  }
}
