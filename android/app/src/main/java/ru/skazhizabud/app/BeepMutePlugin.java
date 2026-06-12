package ru.skazhizabud.app;

import android.content.Context;
import android.media.AudioManager;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

// Маленький собственный плагин: приглушает системный звук на время
// распознавания речи, чтобы убрать встроенный «бип» Android при старте
// прослушивания. Вызывается из script.js: BeepMute.mute() / BeepMute.unmute().
@CapacitorPlugin(name = "BeepMute")
public class BeepMutePlugin extends Plugin {

    private AudioManager getAudioManager() {
        Context context = getContext();
        if (context == null) {
            return null;
        }
        return (AudioManager) context.getSystemService(Context.AUDIO_SERVICE);
    }

    private void setMuted(boolean muted) {
        AudioManager audioManager = getAudioManager();
        if (audioManager == null) {
            return;
        }
        int direction = muted ? AudioManager.ADJUST_MUTE : AudioManager.ADJUST_UNMUTE;
        int[] streams = { AudioManager.STREAM_MUSIC, AudioManager.STREAM_SYSTEM };
        for (int stream : streams) {
            try {
                audioManager.adjustStreamVolume(stream, direction, 0);
            } catch (Exception ignored) {
                // На некоторых телефонах отдельные потоки трогать нельзя — пропускаем.
            }
        }
    }

    @PluginMethod
    public void mute(PluginCall call) {
        setMuted(true);
        call.resolve();
    }

    @PluginMethod
    public void unmute(PluginCall call) {
        setMuted(false);
        call.resolve();
    }
}
