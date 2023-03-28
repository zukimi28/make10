import * as React from 'react';
import './HowToPlayDialog.css';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { IconButton } from '@mui/material';

/**
 * ダイアログ表示非表示アニメーション
 */
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

/**
 * HowToPlayDialogコンポーネントのprops
 * @property {boolean} isOpen - 遊び方ダイアログの表示フラグ
 * @property {boolean} isInitDisplay - 初期表示フラグ
 * @property {Function} closeHowToPlayDialog - 遊び方ダイアログの非表示
 */
type Props = {
	isOpen: boolean;
  isInitDisplay: boolean;
	closeHowToPlayDialog: () => void;
}

/**
 * HowToPlayDialogコンポーネント
 * @param {boolean} isOpen - 遊び方ダイアログの表示フラグ
 * @param {boolean} isInitDisplay - 初期表示フラグ
 * @param {Function} closeHowToPlayDialog - 遊び方ダイアログの非表示
 * @returns HowToPlayDialogコンポーネント
 */
const HowToPlayDialog = ({ isOpen, isInitDisplay, closeHowToPlayDialog }: Props): JSX.Element => {

  return (
    <div>
      <Dialog
        open={isOpen}
				TransitionComponent={Transition}
        scroll={'paper'}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">
          遊び方
          <IconButton
            id="close-how-to-play-dialog-button"
            size="large"
            sx={{ display: isInitDisplay ? 'none' : 'inline-flex' }}
          >
            <HighlightOffIcon onClick={closeHowToPlayDialog} />
          </IconButton>
        </DialogTitle>
        <DialogContent id="scroll-dialog-content" dividers={true}>
          <DialogContentText
            id="scroll-dialog-description"
            tabIndex={-1}
          >
						{[...new Array(500)]
              .map(() => `Todo`,)
              .join('\n')}
          </DialogContentText>
        </DialogContent>
        <DialogActions
          id="scroll-dialog-action"
          sx={{ display: isInitDisplay ? 'flex' : 'none' }}
        >
          <Button
						color="primary"
						variant="contained"
						onClick={closeHowToPlayDialog}
            sx={{ width: '40%' }}
					>START</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default HowToPlayDialog;