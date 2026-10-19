import 'package:flutter/material.dart';

import '../constants.dart';
import '../models/models.dart';

class SeverityChip extends StatelessWidget {
  const SeverityChip({super.key, required this.severity});

  final Severity severity;

  @override
  Widget build(BuildContext context) {
    final (bg, border, fg) = switch (severity) {
      Severity.critical => (
          Fw69Colors.alertCriticalBg,
          Fw69Colors.alertCriticalBorder,
          Fw69Colors.alertCriticalText,
        ),
      Severity.high => (
          Fw69Colors.alertHighBg,
          Fw69Colors.alertHighBorder,
          Fw69Colors.alertHighText,
        ),
      Severity.medium => (
          Fw69Colors.alertMediumBg,
          Fw69Colors.alertMediumBorder,
          Fw69Colors.alertMediumText,
        ),
      Severity.low => (
          Fw69Colors.alertLowBg,
          Fw69Colors.alertLowBorder,
          Fw69Colors.alertLowText,
        ),
    };
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: bg,
        border: Border.all(color: border),
        borderRadius: BorderRadius.circular(6),
      ),
      child: Text(
        severity.label,
        style: TextStyle(color: fg, fontSize: 12, fontWeight: FontWeight.w600),
      ),
    );
  }
}

class StatusChip extends StatelessWidget {
  const StatusChip({super.key, required this.status});

  final IncidentStatus status;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: Fw69Colors.neutralSurface,
        border: Border.all(color: Fw69Colors.neutralBorder),
        borderRadius: BorderRadius.circular(6),
      ),
      child: Text(
        status.label,
        style: const TextStyle(
          color: Fw69Colors.neutralText,
          fontSize: 12,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}

class StageStrip extends StatelessWidget {
  const StageStrip({super.key, required this.status, this.dark = false});

  final IncidentStatus status;
  final bool dark;

  @override
  Widget build(BuildContext context) {
    final idx = status.stageIndex;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Row(
          children: List.generate(incidentStages.length, (i) {
            Color color;
            if (i < idx || status == IncidentStatus.resolved || status == IncidentStatus.closed) {
              color = dark ? Fw69Colors.neutralOnDark : Fw69Colors.neutralActive;
            } else if (i == idx) {
              color = Fw69Colors.primary;
            } else {
              color = dark ? Fw69Colors.neutralOnDark.withValues(alpha: 0.2) : Fw69Colors.neutralBorder;
            }
            return Expanded(
              child: Container(
                height: 6,
                margin: EdgeInsets.only(right: i == incidentStages.length - 1 ? 0 : 4),
                decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(99)),
              ),
            );
          }),
        ),
        const SizedBox(height: 6),
        Text(
          '${idx + 1}/7 · ${status.label}',
          style: TextStyle(
            fontSize: 11,
            color: dark ? Fw69Colors.neutralOnDark.withValues(alpha: 0.7) : Fw69Colors.neutralTextMuted,
          ),
        ),
      ],
    );
  }
}

class MapPlaceholder extends StatelessWidget {
  const MapPlaceholder({super.key, this.height = 180, this.showLegend = true});

  final double height;
  final bool showLegend;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Container(
          height: height,
          decoration: BoxDecoration(
            color: Fw69Colors.neutralBg,
            border: Border.all(color: Fw69Colors.neutralBorder),
            borderRadius: BorderRadius.circular(12),
          ),
          alignment: Alignment.center,
          child: const Text(
            'Map coming soon',
            style: TextStyle(color: Fw69Colors.neutralTextMuted, fontWeight: FontWeight.w600),
          ),
        ),
        if (showLegend) ...[
          const SizedBox(height: 8),
          Wrap(
            spacing: 16,
            runSpacing: 4,
            children: const [
              _LegendDot(label: 'Active fire', color: Fw69Colors.alertCriticalText),
              _LegendDot(label: 'Evacuation center', color: Fw69Colors.neutralTextMuted),
              _LegendDot(label: 'You', color: Fw69Colors.primary),
            ],
          ),
        ],
      ],
    );
  }
}

class _LegendDot extends StatelessWidget {
  const _LegendDot({required this.label, required this.color});

  final String label;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(width: 8, height: 8, decoration: BoxDecoration(color: color, shape: BoxShape.circle)),
        const SizedBox(width: 6),
        Text(label, style: const TextStyle(fontSize: 12, color: Fw69Colors.neutralTextMuted)),
      ],
    );
  }
}

class VideoPlaceholder extends StatelessWidget {
  const VideoPlaceholder({super.key, this.label = 'Video coming soon'});

  final String label;

  @override
  Widget build(BuildContext context) {
    return AspectRatio(
      aspectRatio: 16 / 9,
      child: Container(
        decoration: BoxDecoration(
          color: Fw69Colors.neutralBg,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Fw69Colors.neutralBorder),
        ),
        alignment: Alignment.center,
        child: Text(
          label,
          style: const TextStyle(color: Fw69Colors.neutralTextMuted, fontWeight: FontWeight.w600),
        ),
      ),
    );
  }
}

class SosButton extends StatelessWidget {
  const SosButton({super.key, required this.onPressed});

  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Fw69Colors.primary,
      borderRadius: BorderRadius.circular(24),
      child: InkWell(
        onTap: onPressed,
        borderRadius: BorderRadius.circular(24),
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Row(
            children: [
              Container(
                width: 56,
                height: 56,
                decoration: const BoxDecoration(color: Fw69Colors.neutralOnDark, shape: BoxShape.circle),
                child: const Icon(Icons.videocam, color: Fw69Colors.primary),
              ),
              const SizedBox(width: 16),
              const Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('For fire incidents only', style: TextStyle(color: Fw69Colors.neutralOnDark, fontSize: 12)),
                    Text(
                      'Report Fire · SOS',
                      style: TextStyle(color: Fw69Colors.neutralOnDark, fontSize: 22, fontWeight: FontWeight.w800),
                    ),
                    Text(
                      'Starts a mock SOS report. Live video comes later.',
                      style: TextStyle(color: Fw69Colors.neutralOnDark, fontSize: 13),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class ScreenHeader extends StatelessWidget {
  const ScreenHeader({
    super.key,
    required this.title,
    this.subtitle,
    this.onBack,
    this.trailing,
  });

  final String title;
  final String? subtitle;
  final VoidCallback? onBack;
  final Widget? trailing;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Fw69Colors.neutralBg.withValues(alpha: 0.95),
      child: Padding(
        padding: const EdgeInsets.fromLTRB(16, 12, 16, 12),
        child: Row(
          children: [
            if (onBack != null)
              IconButton(
                onPressed: onBack,
                icon: const Icon(Icons.arrow_back),
                style: IconButton.styleFrom(
                  backgroundColor: Fw69Colors.neutralSurface,
                  side: const BorderSide(color: Fw69Colors.neutralBorder),
                ),
              ),
            if (onBack != null) const SizedBox(width: 8),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                  if (subtitle != null)
                    Text(subtitle!, style: const TextStyle(fontSize: 12, color: Fw69Colors.neutralTextMuted)),
                ],
              ),
            ),
            ?trailing,
          ],
        ),
      ),
    );
  }
}
