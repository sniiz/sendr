import os
from notify_run import Notify as notify_phone
from pync import Notifier as notify_desktop
import string
import random

build_id = ''.join(random.choice(string.ascii_lowercase +
                   string.digits) for _ in range(8))

print(f'build id: {build_id}')


notify_desktop.notify(f'android build {build_id} started',
                      title='sendr', activate='com.microsoft.VSCode')
notify_phone().send(f'android build {build_id} started')
os.system("eas build --profile preview --platform android")
# print('insert build noises here')

notify_desktop.notify(f'android build {build_id} complete',
                      title='sendr', activate='com.microsoft.VSCode')
notify_phone().send(message=f'android build {build_id} complete')


notify_desktop.notify(f'ios build {build_id} started',
                      title='sendr', activate='com.microsoft.VSCode')
notify_phone().send(f'ios build {build_id} started')
os.system("eas build --profile preview --platform ios")
# print('insert build noises here')

notify_desktop.notify(f'ios build {build_id} complete',
                      title='sendr', activate='com.microsoft.VSCode')
notify_phone().send(message=f'ios build {build_id} complete')


notify_desktop.notify(f'web build {build_id} started',
                      title='sendr', activate='com.microsoft.VSCode')
notify_phone().send(f'web build {build_id} started')
os.system("eas build --profile preview --platform web")
# print('insert build noises here')

notify_desktop.notify(f'web  build {build_id} complete',
                      title='sendr', activate='com.microsoft.VSCode')
notify_phone().send(message=f'web build {build_id} complete')
