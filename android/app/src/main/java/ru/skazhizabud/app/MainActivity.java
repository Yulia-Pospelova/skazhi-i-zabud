package ru.skazhizabud.app;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        // Регистрируем собственный плагин приглушения звука (убирает
        // системный «бип» при распознавании речи).
        registerPlugin(BeepMutePlugin.class);
        super.onCreate(savedInstanceState);
    }
}
