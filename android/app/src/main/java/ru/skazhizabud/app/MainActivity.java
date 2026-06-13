package ru.skazhizabud.app;

import android.os.Build;
import android.os.Bundle;
import android.webkit.WebSettings;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        // Регистрируем собственный плагин приглушения звука (убирает
        // системный «бип» при распознавании речи).
        registerPlugin(BeepMutePlugin.class);
        super.onCreate(savedInstanceState);

        // Запрещаем системе (например, тёмной теме Xiaomi/MIUI) принудительно
        // затемнять приложение. Тёмной темой управляет только наш собственный
        // переключатель ☾ — так вид приложения предсказуем.
        try {
            WebSettings settings = this.getBridge().getWebView().getSettings();
            if (Build.VERSION.SDK_INT >= 33) {
                settings.setAlgorithmicDarkeningAllowed(false);
            } else if (Build.VERSION.SDK_INT >= 29) {
                settings.setForceDark(WebSettings.FORCE_DARK_OFF);
            }
        } catch (Exception e) {
            // Оформление не должно ронять приложение — игнорируем сбой.
        }
    }
}
